import DeviceInfo from 'react-native-device-info';
import { Linking } from 'react-native';
import { Base, IotaSDK, API_URL, Trace } from '@tangle-pay/common';
import BigNumber from 'bignumber.js';

export const Bridge = {
	injectedJavaScript: `
        (function(){
			window.TanglePayEnv = 'app';
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
		switch (cmd) {
			case 'goBack':
				Base.goBack();
				break;
			case 'getTanglePayInfo':
				{
					this.sendToSDK({
						cmd,
						data: {
							version: DeviceInfo.getVersion()
						}
					});
				}
				break;
			case 'iota_request':
				const { isKeepPopup, origin } = data;
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
					case 'iota_sendTransaction':
						const { to, value, unit = 'Mi', network = '', merchant = '', item_desc = '' } = params;
						const url = `tanglepay://iota_sendTransaction/${to}?isKeepPopup=${isKeepPopup}&origin=${origin}&value=${value}&unit=${unit}&network=${network}&merchant=${merchant}&item_desc=${item_desc}`;
						Linking.openURL(url);
						break;
					case 'iota_connect':
					case 'iota_sign':
						{
							let { content, expires } = params || {};
							content = content || '';
							expires = expires || 1000 * 3600 * 24;
							const curWallet = await this.getCurWallet();
							if (curWallet.address) {
								const key = `${origin}_${method}_${curWallet.address}_${curWallet.nodeId}`;
								const cacheData = await this.getCacheBgData(key);
								if (cacheData) {
									this[method](origin, expires, content);
									return;
								}
							}
							Linking.openURL(
								`tanglepay://${method}?isKeepPopup=${isKeepPopup}&origin=${origin}&content=${content}&expires=${expires}`
							);
						}
						break;
					case 'iota_changeAccount':
						{
							const { network = '' } = params;
							const url = `tanglepay://${method}?isKeepPopup=${isKeepPopup}&origin=${origin}&network=${network}`;
							Linking.openURL(url);
						}
						break;
					case 'iota_accounts':
					case 'iota_getBalance':
						{
							this[method](origin, params);
						}
						break;
					case 'iota_getPublicKey':
						try {
							const curWallet = await this.getCurWallet();
							const baseSeed = IotaSDK.getSeed(curWallet.seed, curWallet.password);
							const addressKeyPair = IotaSDK.getPair(baseSeed);
							this.sendMessage('iota_getPublicKey', IotaSDK.bytesToHex(addressKeyPair.publicKey));
						} catch (error) {
							this.sendErrorMessage('iota_getPublicKey', {
								msg: error.toString()
							});
						}
						break;
					default:
						break;
				}
				break;
		}
	},
	async getCurWallet() {
		const list = await IotaSDK.getWalletList();
		const curWallet = (list || []).find((e) => e.isSelected);
		return curWallet || {};
	},
	async iota_sign(origin, expires, content) {
		const curWallet = await this.getCurWallet();
		const res = await IotaSDK.iota_sign(curWallet, content);
		if (res) {
			this.sendMessage('iota_sign', res);
			// this.cacheBgData(`${origin}_iota_sign_${curWallet.address}_${curWallet.nodeId}`, res, expires);
		} else {
			this.sendErrorMessage('iota_sign', {
				msg: 'fail'
			});
		}
	},
	async iota_connect(origin, expires) {
		const curWallet = await this.getCurWallet();
		if (curWallet.address) {
			this.sendMessage('iota_connect', {
				address: curWallet.address,
				nodeId: curWallet.nodeId
			});
			const key = `${origin}_iota_connect_${curWallet.address}_${curWallet.nodeId}`;
			this.cacheBgData(key, 1, expires);

			Trace.dappConnect(origin.replace(/.+\/\//, ''), curWallet.address, curWallet.nodeId, IotaSDK.curNode.token);
		}
	},
	async eth_getBalance(origin, { assetsList, addressList }) {
		try {
			// iota
			assetsList = assetsList || [];
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
			amount = Number(amount);
			const assetsData = {
				amount
			};
			const curWallet = await this.getCurWallet();
			const key = `${origin}_eth_getBalance_${curWallet?.address}_${curWallet?.nodeId}`;
			this.sendMessage('eth_getBalance', assetsData);
		} catch (error) {
			Toast.hideLoading();
			this.sendErrorMessage('eth_getBalance', {
				msg: error.toString()
			});
		}
	},
	async iota_accounts() {
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
				this.sendMessage('iota_accounts', addressList);
			} else {
				this.sendErrorMessage('iota_accounts', {
					msg: 'Wallet not authorized',
					status: 2
				});
			}
		} catch (error) {
			this.sendErrorMessage('iota_accounts', {
				msg: error.toString(),
				status: 3
			});
		}
	},
	async iota_getBalance(origin, { assetsList, addressList }) {
		try {
			// iota
			assetsList = assetsList || [];
			let amount = BigNumber(0);
			if (assetsList.includes('iota') && !IotaSDK.isWeb3Node) {
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

			// stake
			let othersDic = {};
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

			const assetsData = {
				amount,
				collectibles,
				others: Object.values(othersDic)
			};

			this.sendMessage('iota_getBalance', assetsData);
		} catch (error) {
			this.sendErrorMessage('iota_getBalance', {
				msg: error.toString()
			});
		}
	},
	accountsChanged(address, nodeId) {
		this.callSDKFunc('iota_event_accountsChanged', {
			address,
			nodeId
		});
	},
	sendMessage(method, response) {
		this.sendToSDK({
			cmd: 'iota_request',
			code: 200,
			data: {
				method,
				response
			}
		});
	},
	sendErrorMessage(method, response) {
		this.sendToSDK({
			cmd: 'iota_request',
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
