import DeviceInfo from 'react-native-device-info';
import { Linking } from 'react-native';
import { Base, IotaSDK, API_URL, Trace } from '@tangle-pay/common';
import BigNumber from 'bignumber.js';
import { ethGetBlockByNumber, ethGasPrice, setWeb3Client } from './EthereumWeb3Impl';

const DATA_PER_REQUEST_PREFIX = 'data.per.request.prefix.';
const dataPerRequestHelper = {
	hasDataOnRequestMap: {},
	getDataPerRequestKey(reqId) {
		return DATA_PER_REQUEST_PREFIX + reqId;
	},
	storeDataPerRequest(reqId, data) {
		if (!data) {
			return;
		}
		Base.setLocalData(this.getDataPerRequestKey(reqId), data);
		this.hasDataOnRequestMap[reqId] = true;
	},
	removeDataPerRequest(reqId) {
		Base.removeLocalData(this.getDataPerRequestKey(reqId));
		delete this.hasDataOnRequestMap[reqId];
	},
	clearDataOnRequest() {
		const reqIds = Object.keys(this.hasDataOnRequestMap);
		reqIds.forEach((reqId) => {
			this.removeDataPerRequest(reqId);
		});
	}
};

export const Bridge = {
	dataPerRequestHelper,
	injectedJavaScript: `
        (function(){
			window.TanglePayEnv = 'app';
			const meta = document.createElement('meta'); 
			meta.setAttribute('content', 'initial-scale=1, maximum-scale=1, user-scalable=0'); 
			meta.setAttribute('name', 'viewport'); 
	        document.getElementsByTagName('head')[0].appendChild(meta); 
        })()
    `,
	injectJavaScript: null,
	sendToSDK(params) {
		params.cmd = `contentToInject##${params.cmd}`;
		const injectJavaScriptStr = `
            (
                function(){
                    window.postMessage(${JSON.stringify(params)}, '*')
                }
            )()
        `;
		this.injectJavaScript && this.injectJavaScript(injectJavaScriptStr);
	},
	callSDKFunc(func, params) {
		const injectJavaScriptStr = `
            (
                function(){
					if(window.${func}){
						window.${func}(${JSON.stringify(params)})
					}
                }
            )()
        `;
		this.injectJavaScript && this.injectJavaScript(injectJavaScriptStr);
	},
	async onMessage(e) {
		let data = e?.nativeEvent?.data || {};
		try {
			data = JSON.parse(data);
		} catch (error) {
			data = {};
		}

		const cmd = (data?.cmd || '').replace('injectToContent##', '');
		const reqId = data.id ? data.id : 0;
		switch (cmd) {
			case 'goBack':
				Base.goBack();
				break;
			case 'getTanglePayInfo':
				{
					this.sendToSDK({
						cmd,
						id: reqId,
						data: {
							version: DeviceInfo.getVersion()
						}
					});
				}
				break;
			case 'iota_request':
				const { isKeepPopup } = data;
				const origin = Bridge.origin;
				const { method, params } = data?.data;
				const curWallet = await this.getCurWallet();
				const connectKey = `${origin}_iota_connect_${curWallet.address}_${curWallet.nodeId}`;
				const connectRes = await this.getCacheBgData(connectKey);
				if (!connectRes && method !== 'iota_connect') {
					this.sendErrorMessage(method, {
						msg: 'not authorized',
						status: 2
					});
					return;
				}
				switch (method) {
					case 'eth_sendTransaction':
					case 'iota_sendTransaction':
						const checkSignData = (data) => {
							let isCall = false;
							[
								'0xdd62ed3e',
								'0x70a08231',
								'0x313ce567',
								'0xa0712d68',
								'0x07546172',
								'0x06fdde03',
								'0x95d89b41',
								'0x18160ddd'
							].forEach((e) => {
								if (RegExp(`^${e}`).test(data)) {
									isCall = true;
								}
							});
							return isCall;
						};

						if (method === 'eth_sendTransaction' && params.data && checkSignData(params.data)) {
							const abiRes = IotaSDK.getAbiParams(params.to, params.data);
							if (abiRes.web3Contract) {
								let abiParams = [];
								for (const i in abiRes.params) {
									if (Object.hasOwnProperty.call(abiRes.params, i) && /^\d$/.test(i)) {
										abiParams.push(abiRes.params[i]);
									}
								}
								abiRes.web3Contract.methods[abiRes.functionName](...abiParams)
									.call()
									.then((res) => {
										this.sendMessage(method, res, reqId);
									})
									.catch((error) => {
										this.sendErrorMessage(
											method,
											{
												msg: error.toString()
											},
											reqId
										);
									});
							}
						} else {
							const {
								to,
								value,
								unit = '',
								network = '',
								merchant = '',
								item_desc = '',
								assetId = '',
								data = '',
								tag = '',
								nftId = '',
								gas = ''
							} = params;
							const url = `tanglepay://${method}/${to}?isKeepPopup=${isKeepPopup}&origin=${origin}&value=${value}&unit=${unit}&network=${network}&merchant=${merchant}&item_desc=${item_desc}&assetId=${assetId}&taggedData=${data}&tag=${tag}&nftId=${nftId}&gas=${gas}&reqId=${reqId}`;
							const { metadata } = params;
							const dataPerRequest = {
								metadata: metadata || null
							};
							this.dataPerRequestHelper.storeDataPerRequest(reqId, dataPerRequest);
							Linking.openURL(url);
						}
						break;
					case 'iota_connect':
					case 'iota_sign':
						{
							let { content, expires } = params || {};
							content = content || '';
							expires = expires || 100000000000000000000;
							const curWallet = await this.getCurWallet();
							if (curWallet.address) {
								const key = `${origin}_${method}_${curWallet.address}_${curWallet.nodeId}`;
								const cacheData = await this.getCacheBgData(key);
								if (cacheData) {
									this[method](origin, expires, content, '', reqId);
									return;
								}
							}
							Linking.openURL(
								`tanglepay://${method}?isKeepPopup=${isKeepPopup}&origin=${origin}&content=${content}&expires=${expires}&reqId=${reqId}`
							);
						}
						break;
					case 'iota_merge_nft':
						{
							Base.push('assets/nftMerge', {
								...params
							});
						}
						break;
					case 'iota_changeAccount':
						{
							const { network = '' } = params;
							const url = `tanglepay://${method}?isKeepPopup=${isKeepPopup}&origin=${origin}&network=${network}&reqId=${reqId}`;
							Linking.openURL(url);
						}
						break;
					case 'iota_accounts':
					case 'iota_getBalance':
					case 'eth_getBalance':
						{
							this[method](origin, params, reqId);
						}
						break;
					case 'iota_getPublicKey':
						try {
							const { address } = params || {};
							const targetWallet = await this.getWallet(address);
							if (!targetWallet) {
								this.sendErrorMessage(
									'iota_getPublicKey',
									{
										msg: 'Wallet not found'
									},
									reqId
								);
							} else {
								this.sendMessage('iota_getPublicKey', targetWallet.publicKey, reqId);
							}
						} catch (error) {
							this.sendErrorMessage(
								'iota_getPublicKey',
								{
									msg: error.toString()
								},
								reqId
							);
						}
						break;
					case 'iota_getWalletType':
						try {
							const { address } = params || {};
							const targetWallet = await this.getWallet(address);
							if (!targetWallet) {
								this.sendErrorMessage(
									'iota_getWalletType',
									{
										msg: 'Wallet not found'
									},
									reqId
								);
							} else {
								this.sendMessage('iota_getWalletType', targetWallet.type, reqId);
							}
						} catch (error) {
							this.sendErrorMessage(
								'iota_getWalletType',
								{
									msg: error.toString()
								},
								reqId
							);
						}
						break;
					case 'eth_importNFT':
						if (!IotaSDK.isWeb3Node) {
							this.sendErrorMessage(
								'eth_importNFT',
								{
									msg: 'Node is error.'
								},
								reqId
							);
						}
						try {
							this.ensureWeb3Client();
							let { nft, tokenId } = params;
							// Lowercase nft
							nft = nft.toLocaleLowerCase();
							const address = curWallet.address;
							const importedNFTKey = `${address}.nft.importedList`;
							const importedNFTInStorage = (await Base.getLocalData(importedNFTKey)) ?? {};

							if (
								importedNFTInStorage?.[nft] &&
								importedNFTInStorage[nft].find((item) => item.tokenId === tokenId)
							) {
								throw new Error('This NFT has already been imported.');
							}

							const nftContract = IotaSDK.getNFTContract(nft);
							const checkIsOwnder = await IotaSDK.checkNFTOwner(nftContract, tokenId, address);

							if (!checkIsOwnder) {
								throw new Error('This NFT is not owned by the user.');
							}

							const tokenURI = await nftContract.methods.tokenURI(tokenId).call();
							const tokenURIRes = await IotaSDK.parseNFTTokenURI(tokenURI);

							if (!tokenURIRes) {
								throw new Error('Failed to parse nft tokenURI.');
							}

							const name = await nftContract.methods.name().call();

							const importedNFTInfo = {
								tokenId,
								name,
								image: tokenURIRes.image,
								description: tokenURIRes.description,
								standard: 'ERC 721',
								collectionId: nft
							};
							importedNFTInStorage[nft] = [...(importedNFTInStorage[nft] ?? []), importedNFTInfo];

							Base.setLocalData(importedNFTKey, importedNFTInStorage);

							this.sendMessage(
								'eth_importNFT',
								{
									nft,
									tokenId
								},
								reqId
							);
							Base.globalDispatch({
								type: 'nft.forceRequest',
								data: Math.random()
							});
						} catch (error) {
							this.sendErrorMessage(
								'eth_importNFT',
								{
									msg: error.toString()
								},
								reqId
							);
						}
						break;
					case 'eth_importContract':
						try {
							const contract = params?.contract;
							const web3Contract = IotaSDK.getContract(contract);
							if (web3Contract) {
								const [token, decimal] = await Promise.all([
									web3Contract.methods.symbol().call(),
									web3Contract.methods.decimals().call()
								]);
								IotaSDK.importContract(contract, token, decimal);
								this.sendMessage(
									'eth_importContract',
									{
										contract,
										token,
										decimal
									},
									reqId
								);
							} else {
								this.sendErrorMessage(
									'eth_importContract',
									{
										msg: 'contract is error'
									},
									reqId
								);
							}
						} catch (error) {
							this.sendErrorMessage(
								'eth_importContract',
								{
									msg: error.toString()
								},
								reqId
							);
						}
						break;
					case 'get_login_token':
						{
							const token = (await Base.getLocalData('token')) || '';
							this.sendMessage('get_login_token', token, reqId);
						}
						break;
					case 'eth_getBlockByNumber':
						try {
							const res = await this.ethGetBlockByNumber(params);
							this.sendMessage(method, res, reqId);
						} catch (e) {
							this.sendErrorMessage(method, e.message, reqId);
						}
						break;
					case 'eth_gasPrice':
						try {
							const res = await this.ethGasPrice(params);
							this.sendMessage(method, res, reqId);
						} catch (e) {
							this.sendErrorMessage(method, e.message, reqId);
						}
						break;
					default:
						break;
				}
				break;
		}
	},
	async getCurWallet() {
		const curWallet = await this.getWallet();
		return curWallet || {};
	},
	async getWallet(address) {
		const list = await IotaSDK.getWalletList();
		if (address) {
			return (list || []).find((e) => e.address === address);
		} else {
			return (list || []).find((e) => e.isSelected);
		}
	},
	async iota_sign(origin, expires, content, password, reqId) {
		const curWallet = await this.getCurWallet();
		const res = await IotaSDK.iota_sign({ ...curWallet, password }, content);
		if (res) {
			this.sendMessage('iota_sign', res, reqId);
			// this.cacheBgData(`${origin}_iota_sign_${curWallet.address}_${curWallet.nodeId}`, res, expires);
		} else {
			this.sendErrorMessage(
				'iota_sign',
				{
					msg: 'fail'
				},
				reqId
			);
		}
	},
	ensureWeb3Client() {
		if (IotaSDK.isWeb3Node) {
			setWeb3Client(IotaSDK.client);
		}
	},
	async ethGetBlockByNumber(params) {
		return await ethGetBlockByNumber(...params);
	},
	async ethGasPrice(params) {
		return await ethGasPrice(...params);
	},
	async iota_connect(origin, expires, _, _1, reqId) {
		const curWallet = await this.getCurWallet();
		if (curWallet.address) {
			const obj = {
				address: curWallet.address,
				nodeId: curWallet.nodeId
			};
			if (IotaSDK.checkWeb3Node(curWallet.nodeId)) {
				obj.chainId = await IotaSDK.client.eth.getChainId();
			}
			this.sendMessage(
				'iota_connect',
				{
					...obj
				},
				reqId
			);
			const key = `${origin}_iota_connect_${curWallet.address}_${curWallet.nodeId}`;
			this.cacheBgData(key, 1, expires);

			Trace.dappConnect(origin.replace(/.+\/\//, ''), curWallet.address, curWallet.nodeId, IotaSDK.curNode.token);
		}
	},
	async eth_getBalance(origin, { assetsList, addressList }, reqId) {
		try {
			const curWallet = await this.getCurWallet();
			assetsList = assetsList || [];
			if (addressList.length === 0) {
				addressList = (await Base.getLocalData(`valid.addresses.${curWallet.address}`)) || [];
			}
			let amount = BigNumber(0);
			if (assetsList.includes('evm') && IotaSDK.isWeb3Node) {
				if (!IotaSDK.client || !IotaSDK?.client?.eth) {
					throw 'network error.';
				}
				const res = await Promise.all(addressList.map((e) => IotaSDK.client.eth.getBalance(e)));
				res.forEach((e) => {
					amount = amount.plus(e);
				});
			}
			let collectibles = [];
			if (assetsList.includes('soonaverse') && IotaSDK.isWeb3Node) {
				collectibles = await IotaSDK.getNfts(addressList);
			}
			amount = Number(amount);
			const assetsData = {
				amount,
				collectibles
			};
			const key = `${origin}_eth_getBalance_${curWallet?.address}_${curWallet?.nodeId}`;
			this.sendMessage('eth_getBalance', assetsData, reqId);
		} catch (error) {
			Toast.hideLoading();
			this.sendErrorMessage(
				'eth_getBalance',
				{
					msg: error.toString()
				},
				reqId
			);
		}
	},
	async iota_accounts(_, _1, reqId) {
		try {
			const curWallet = await this.getCurWallet();
			let addressList = [];

			if (IotaSDK.isWeb3Node) {
				addressList = [curWallet.address];
			} else {
				if (curWallet.address) {
					const res = await IotaSDK.getValidAddresses(curWallet);
					addressList = res?.addressList || [];
					if (addressList.length === 0) {
						addressList = [curWallet.address];
					}
				}
			}
			if (curWallet.address) {
				const res = await IotaSDK.getValidAddresses(curWallet);
				addressList = res?.addressList || [];
				if (addressList.length === 0) {
					addressList = [curWallet.address];
				}
			}
			if (addressList.length > 0) {
				this.sendMessage('iota_accounts', addressList, reqId);
			} else {
				this.sendErrorMessage(
					'iota_accounts',
					{
						msg: 'Wallet not authorized',
						status: 2
					},
					reqId
				);
			}
		} catch (error) {
			this.sendErrorMessage(
				'iota_accounts',
				{
					msg: error.toString(),
					status: 3
				},
				reqId
			);
		}
	},
	async iota_getBalance(origin, { assetsList, addressList }, reqId) {
		try {
			const curWallet = await this.getCurWallet();
			if (addressList.length === 0) {
				addressList = (await Base.getLocalData(`valid.addresses.${curWallet.address}`)) || [];
			}
			assetsList = assetsList || [];
			let amount = BigNumber(0);
			if (assetsList.includes('iota') && !IotaSDK.checkSMR(curWallet.nodeId) && !IotaSDK.isWeb3Node) {
				const res = await Promise.all(addressList.map((e) => IotaSDK.client.address(e)));
				res.forEach((e) => {
					amount = amount.plus(e.balance);
				});
			}
			amount = Number(amount);

			// soonaverse
			let collectibles = [];
			if (assetsList.includes('soonaverse')) {
				collectibles = await IotaSDK.getNfts(addressList);
			}

			let nativeTokens = [];
			let othersDic = {};
			if (IotaSDK.checkSMR(curWallet.nodeId)) {
				if (assetsList.includes('smr') || assetsList.includes('iota')) {
					const {list:smrAessets} = (await IotaSDK.getBalance(curWallet, addressList)) || {list:[]};
					amount = smrAessets.find((e) => e.token === IotaSDK.curNode?.token)?.realAvailable;
					nativeTokens = smrAessets.filter((e) => e.token !== IotaSDK.curNode?.token);
					let tokens = nativeTokens.map((e) => e.tokenId);
					tokens = await Promise.all(nativeTokens.map((e) => IotaSDK.foundry(e.tokenId)));
					tokens = tokens.map((e) => IotaSDK.handleFoundry(e));
					nativeTokens = nativeTokens.map((e, i) => {
						return {
							id: e.tokenId,
							amount: e.realBalance,
							info: tokens[i]
						};
					});
				}
			} else {
				if (assetsList.includes('smr') || assetsList.includes('asmb')) {
					let eventConfig = await fetch(`${API_URL}/events.json?v=${new Date().getTime()}`).then((res) =>
						res.json()
					);
					eventConfig = eventConfig?.rewards || {};
					const othersRes = await IotaSDK.getAddressListRewards(addressList);
					for (const i in othersRes) {
						const { symbol, amount, minimumReached } = othersRes[i];
						const { ratio, unit } = eventConfig[symbol];
						if (minimumReached && assetsList.includes(unit.toLocaleLowerCase())) {
							othersDic[symbol] = othersDic[symbol] || {
								amount: 0,
								symbol,
								icon: `http://api.iotaichi.com/icon/${unit}.png`
							};
							othersDic[symbol].amount += amount * ratio;
						}
					}
				}
			}

			const assetsData = {
				amount,
				collectibles,
				others: Object.values(othersDic),
				nativeTokens
			};

			this.sendMessage('iota_getBalance', assetsData, reqId);
		} catch (error) {
			this.sendErrorMessage(
				'iota_getBalance',
				{
					msg: error.toString()
				},
				reqId
			);
		}
	},
	accountsChanged({ address, nodeId, chainId, reqId }) {
		this.callSDKFunc('iota_event_accountsChanged', {
			address,
			nodeId,
			chainId,
			id: reqId
		});
	},
	sendMessage(method, response, reqId) {
		this.sendToSDK({
			cmd: 'iota_request',
			id: reqId,
			code: 200,
			data: {
				method,
				response
			}
		});
	},
	sendErrorMessage(method, response, reqId) {
		this.sendToSDK({
			cmd: 'iota_request',
			id: reqId,
			code: -1,
			data: {
				method,
				response
			}
		});
	},
	cacheBgData(key, cacheData, expires) {
		key = key.replace(/[^0-9a-zA-Z_]/gi, '').replace(/_/g, '.');
		Base.setLocalData(key, cacheData, expires);
	},
	async getCacheBgData(key) {
		key = key.replace(/[^0-9a-zA-Z_]/gi, '').replace(/_/g, '.');
		return await Base.getLocalData(key);
	}
};
