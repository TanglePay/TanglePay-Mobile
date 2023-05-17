import React, { useState, useEffect, useRef } from 'react';
import { Linking, KeyboardAvoidingView, InteractionManager, TouchableOpacity } from 'react-native';
import { View, Text, Item, Input, Button, Spinner } from 'native-base';
import Modal from 'react-native-modal';
import { I18n, IotaSDK, Base } from '@tangle-pay/common';
import { SS, ThemeVar, Toast, SvgIcon } from '@/common';
import { useGetNodeWallet, useChangeNode } from '@tangle-pay/store/common';
import { useStore } from '@tangle-pay/store';
import BigNumber from 'bignumber.js';
import { Bridge } from '@/common/bridge';
import { useGetParticipationEvents } from '@tangle-pay/store/staking';
import { Unit } from '@iota/unit-converter';
import ReactNativeBiometrics from 'react-native-biometrics';
import { GasDialog } from '@/common/components/gasDialog';
import { BleDevices } from '@/common/components/bleDevices';
import { context, checkWalletIsPasswordEnabled, getIsUnlocked } from '@tangle-pay/domain';

const rnBiometrics = new ReactNativeBiometrics();
export const DappDialog = () => {
	const gasDialog = useRef();
	const bleDevices = useRef();
	const [isShow, setShow] = useState(false);
	const [isLoading, setLoading] = useState(false);
	const [canShowDappDialog] = useStore('common.canShowDappDialog');
	useGetParticipationEvents();
	const [password, setPassword] = useState('');
	const [showPwd, setShowPwd] = useState(false);
	const [curPwd] = useStore('common.curPwd');
	const [isPwdInput, setIsPwdInput] = useStore('common.pwdInput');
	const [isNotPrompt] = useStore(false);
	const [dappData, setDappData] = useState({
		texts: []
	});
	const [deepLink, setDeepLink] = useState('');
	const selectTimeHandler = useRef();
	const [curWallet] = useGetNodeWallet();
	const [assetsList] = useStore('common.assetsList');
	// const [statedAmount] = useStore('staking.statedAmount');
	const [curNodeId] = useStore('common.curNodeId');
	const changeNode = useChangeNode();
	const [gasInfo, setGasInfo] = useState({});
	const isLedger = curWallet.type == 'ledger';
	const [isWalletPassowrdEnabled, setIsWalletPassowrdEnabled] = useState(true);
	const isBio = !!(curPwd || {})[curWallet.id];
	useEffect(() => {
		checkWalletIsPasswordEnabled(curWallet.id).then((res) => {
			setIsWalletPassowrdEnabled(res);
			if (!res) {
				setPassword(context.state.pin);
			}
		});
	}, [curWallet.id, canShowDappDialog]);
	const show = () => {
		if (context.state.isPinSet && !getIsUnlocked()) {

		} else {
			requestAnimationFrame(() => {
				setShow(true);
			});
		}
	};
	const hide = () => {
		setShow(false);
		setLoading(false);
	};
	const onHandleCancel = async ({ type }) => {
		switch (type) {
			case 'iota_sign':
			case 'iota_connect':
				InteractionManager.runAfterInteractions(() => {
					Bridge.sendErrorMessage(type, {
						msg: 'cancel'
					});
				});
				break;

			default:
				break;
		}
	};
	const onExecute = async ({
		address,
		return_url,
		content,
		type,
		amount,
		origin,
		expires,
		taggedData,
		contract,
		foundryData,
		tag,
		nftId,
		reqId
	}) => {
		const noPassword = ['iota_connect', 'iota_changeAccount', 'iota_getPublicKey'];
		if (!noPassword.includes(type)) {
			if (!isLedger) {
				const isPassword = await IotaSDK.checkPassword(curWallet.seed, password);
				if (!isPassword) {
					return Toast.error(I18n.t('assets.passwordError'));
				}
			}
		}
		let messageId = '';
		switch (type) {
			case 'send':
			case 'iota_sendTransaction':
			case 'eth_sendTransaction':
				{
					let mainBalance = 0;
					let curToken = IotaSDK.curNode?.token;
					if (contract) {
						curToken =
							(IotaSDK.curNode.contractList || []).find((e) => e.contract === contract)?.token ||
							IotaSDK.curNode?.token;
					}
					let assets = assetsList.find((e) => e.name === curToken) || {};
					if (foundryData) {
						mainBalance = assetsList.find((e) => e.name === IotaSDK.curNode?.token)?.realBalance;
						assets = assetsList.find((e) => e.name === foundryData.symbol);
						if (!assets) {
							assets = {
								realBalance: 0,
								decimal: foundryData.decimals,
								name: foundryData.symbol
							};
						}
					}
					let realBalance = BigNumber(assets.realBalance || 0);
					if (IotaSDK.checkSMR(curWallet.nodeId) && !assets.isSMRToken) {
						realBalance = BigNumber(assets.realAvailable || 0);
					}
					// const bigStatedAmount = BigNumber(statedAmount).times(IotaSDK.IOTA_MI);
					// realBalance = realBalance.minus(bigStatedAmount);
					let residue = Number(realBalance.minus(amount)) || 0;
					let decimal = Math.pow(10, assets.decimal);
					try {
						if (!IotaSDK.checkWeb3Node(curWallet.nodeId) && !IotaSDK.checkSMR(curWallet.nodeId)) {
							if (amount < decimal) {
								return Toast.error(I18n.t('assets.sendBelow1Tips'));
							}
						}
						if (residue < 0) {
							return Toast.error(I18n.t('assets.balanceError'));
						}
						if (!IotaSDK.checkWeb3Node(curWallet.nodeId) && !IotaSDK.checkSMR(curWallet.nodeId)) {
							if (residue < decimal && residue != 0) {
								return Toast.error(I18n.t('assets.residueBelow1Tips'));
							}
						}
						setLoading(true);
						// nft
						if (nftId) {
							amount = 1;
							residue = 0;
							realBalance = 0;
							decimal = 0;
						}
						let res = undefined;
						if (isLedger) {
							await bleDevices.current.show();
						}
						res = await IotaSDK.send({ ...curWallet, password }, address, amount, {
							contract: contract || assets?.contract,
							token: assets?.name,
							taggedData,
							realBalance: Number(realBalance),
							residue,
							tokenId: foundryData?.tokenId,
							decimal: assets?.decimal,
							mainBalance,
							awaitStake: true,
							tag,
							nftId,
							gas: gasInfo.gasLimit,
							gasPrice: gasInfo.gasPriceWei
						});

						if (!res) {
							Bridge.sendErrorMessage(type, error, reqId);
							setLoading(false);
							return;
						}
						messageId = res.messageId;
						if (type === 'iota_sendTransaction' || type === 'eth_sendTransaction') {
							Bridge.sendMessage(type, res, reqId);
						}
						setLoading(false);
						// Toast.success(
						// 	I18n.t(
						// 		IotaSDK.checkWeb3Node(curWallet.nodeId) ? 'assets.sendSucc' : 'assets.sendSuccRestake'
						// 	)
						// );
						hide();
						const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
						await sleep(2000);
					} catch (error) {
						if (type === 'iota_sendTransaction' || type === 'eth_sendTransaction') {
							Bridge.sendErrorMessage(type, String(error), reqId);
						}
						setLoading(false);
						Toast.error(String(error));
						// Toast.error(
						// 	`${error.toString()}---amount:${amount}---residue:${residue}---realBalance:${Number(
						// 		realBalance
						// 	)}`,
						// 	{
						// 		duration: 5000
						// 	}
						// );
					}
				}
				break;
			case 'sign':
				try {
					if (isLedger) {
						await bleDevices.current.show();
					}
					messageId = await IotaSDK.iota_sign({ ...curWallet, password }, content);
					setLoading(false);
				} catch (error) {
					setLoading(false);
					Toast.error(error.toString(), {
						duration: 5000
					});
				}
				break;
			case 'iota_changeAccount':
				{
					await Bridge.sendMessage(
						type,
						{
							address: curWallet.address,
							nodeId: curWallet.nodeId,
							network: IotaSDK.nodes.find((e) => e.id == curWallet.nodeId)?.network
						},
						reqId
					);
					Toast.hideLoading();
				}
				break;
			case 'iota_connect':
				{
					await Bridge.iota_connect(origin, expires, '', '', reqId);
				}
				break;
			case 'iota_sign':
				{
					if (isLedger) {
						await bleDevices.current.show();
					}
					await Bridge.iota_sign(origin, expires, content, password, reqId);
				}
				break;
			default:
				break;
		}
		if (messageId && return_url) {
			return_url = decodeURIComponent(return_url);
			const url = `${return_url}${/\?/.test(return_url) ? '&' : '?'}message_id=${messageId}`;
			const route = Base.navigator?.getCurrentRoute();
			if (route?.params?.setWebviewUrl) {
				route?.params?.setWebviewUrl(url);
			} else {
				Linking.canOpenURL(url)
					.then((bool) => {
						if (bool) {
							Linking.openURL(url);
						} else {
							Toast.error('link error');
						}
					})
					.catch(() => {
						Toast.error('link error');
					});
			}
		}
		hide();
	};
	const handleUrl = async (url) => {
		if (!url) {
			return;
		}
		const res = Base.handlerParams(url);
		const regex = /(<([^>]+)>)/gi;
		for (const i in res) {
			if (Object.hasOwnProperty.call(res, i)) {
				res[i] = String(res[i] || '').replace(regex, '');
			}
		}
		let {
			network,
			value,
			unit,
			return_url,
			item_desc = '',
			merchant = '',
			content = '',
			origin = '',
			expires = '',
			taggedData = '',
			assetId = '',
			nftId = '',
			tag = '',
			gas = '',
			reqId = 0
		} = res;
		let toNetId;
		if (network) {
			toNetId = IotaSDK.nodes.find((e) => e.network == network)?.id;
		}
		if (toNetId && parseInt(toNetId) !== parseInt(curNodeId)) {
			await changeNode(toNetId);
			return;
		} else if (!curWallet.address) {
			selectTimeHandler.current = setTimeout(() => {
				Base.push('assets/wallets', { nodeId: toNetId || '' });
			}, 500);
		} else {
			setDeepLink('');
			clearTimeout(selectTimeHandler.current);
			const path = url.replace('tanglepay://', '').split('?')[0];
			if (path) {
				let [type, address] = path.split('/');
				switch (type) {
					case 'send':
					case 'iota_sendTransaction':
					case 'eth_sendTransaction':
						{
							value = BigNumber(value || 0).valueOf();
							if (nftId) {
								value = 1;
							}
							let foundryData = null;
							if (!value && !taggedData) {
								Toast.error('Required: value');
							}
							if (!address) {
								Toast.error('Required: address');
							}
							address = address.toLocaleLowerCase();
							let showValue = '';
							let showUnit = '';
							let sendAmount = 0;
							let contract = '';
							let abiFunc = '';
							let abiParams = [];
							let gasFee = '';
							let contractAmount = '';
							let showContractAmount = '';
							if (IotaSDK.checkWeb3Node(toNetId || curNodeId)) {
								unit = unit || 'wei';
								let curToken = IotaSDK.curNode?.token;
								sendAmount = Number(new BigNumber(value || 0));
								sendAmount = sendAmount || 0;
								showValue = IotaSDK.client.utils.fromWei(IotaSDK.getNumberStr(sendAmount), 'ether');

								let [gasPrice, gasLimit] = await Promise.all([
									IotaSDK.client.eth.getGasPrice(),
									IotaSDK.getDefaultGasLimit(
										curWallet.address,
										taggedData ? address : '',
										IotaSDK.getNumberStr(sendAmount || 0),
										taggedData
									)
								]);

								if (taggedData) {
									if (IotaSDK.curNode?.contractGasPriceRate) {
										gasPrice = IotaSDK.getNumberStr(
											parseInt(gasPrice * IotaSDK.curNode?.contractGasPriceRate)
										);
									}
									if (IotaSDK.curNode?.contractGasLimitRate) {
										gasLimit = IotaSDK.getNumberStr(
											parseInt(gasLimit * IotaSDK.curNode?.contractGasLimitRate)
										);
									}
								} else {
									if (IotaSDK.curNode?.gasPriceRate) {
										gasPrice = IotaSDK.getNumberStr(
											parseInt(gasPrice * IotaSDK.curNode?.gasPriceRate)
										);
									}
									if (IotaSDK.curNode?.gasLimitRate) {
										gasLimit = IotaSDK.getNumberStr(
											parseInt(gasLimit * IotaSDK.curNode?.gasLimitRate)
										);
									}
								}

								const gasPriceWei = gasPrice;
								gasLimit = gasLimit || 21000;
								let totalWei = new BigNumber(gasPrice).times(gasLimit);
								totalWei = IotaSDK.getNumberStr(totalWei);
								const totalEth = IotaSDK.client.utils.fromWei(totalWei, 'ether');
								gasPrice = IotaSDK.client.utils.fromWei(gasPrice, 'gwei');
								const total = IotaSDK.client.utils.fromWei(totalWei, 'gwei');
								setGasInfo({
									gasLimit,
									gasPrice,
									gasPriceWei,
									total,
									totalEth
								});

								if (taggedData) {
									contract = address;
									const { functionName, params, web3Contract, isErc20 } = IotaSDK.getAbiParams(
										address,
										taggedData
									);
									for (const i in params) {
										if (Object.hasOwnProperty.call(params, i) && /^\d$/.test(i)) {
											abiParams.push(params[i]);
										}
									}
									if (sendAmount) {
										abiParams.push(`${showValue} ${curToken}`);
									}
									abiFunc = functionName;
									switch (functionName) {
										case 'transfer':
											address = params[0];
											contractAmount = params[1];
											break;
										case 'approve':
											const contractGasLimit =
												(IotaSDK.curNode.contractList || []).find(
													(e) => e.contract === contract
												)?.gasLimit || 0;
											const { gasPrice } = await IotaSDK.getGasLimit(
												contractGasLimit,
												curWallet.address,
												0
											);
											gasFee = IotaSDK.client.utils.fromWei(
												IotaSDK.getNumberStr(BigNumber(gasPrice).valueOf()),
												'ether'
											);
											gasFee = `${gasFee} ${IotaSDK.curNode.token}`;
											address = params[0];
											contractAmount = params[1];
											break;
										default:
											break;
									}
									contractAmount = Number(new BigNumber(contractAmount));
									try {
										if (web3Contract?.methods?.symbol) {
											curToken = await web3Contract.methods.symbol().call();
										} else {
											curToken = IotaSDK.curNode?.token;
										}
										let decimals = 0;
										if (web3Contract?.methods?.decimals) {
											decimals = await web3Contract.methods.decimals().call();
										}

										if (isErc20) {
											IotaSDK.importContract(contract, curToken);
										}
										showContractAmount = new BigNumber(contractAmount)
											.div(BigNumber(10).pow(decimals))
											.valueOf();
									} catch (error) {
										console.log(error);
									}
									Toast.hideLoading();
								}
								showUnit = curToken;
							} else {
								if (IotaSDK.checkSMR(toNetId || curNodeId)) {
									if (nftId) {
										value = 1;
										showValue = 1;
										unit = Base.handleAddress(nftId);
										setLoading(true);
										if (IotaSDK?.IndexerPluginClient?.nft) {
											unit = [];
											const getNftInfo = async (curNftId) => {
												let nftInfo = await IotaSDK.IndexerPluginClient.nft(curNftId);
												if (nftInfo?.items?.[0]) {
													nftInfo = await IotaSDK.client.output(nftInfo?.items?.[0]);

													let info = (nftInfo?.output?.immutableFeatures || []).find((d) => {
														return d.type == 2;
													});
													if (info && info.data) {
														try {
															info = IotaSDK.hexToUtf8(info.data);
															info = JSON.parse(info);
															unit.push(info.name);
														} catch (error) {
															console.log(error);
														}
													}
												}
											};
											const nfts = nftId.split(',');
											await Promise.all(nfts.map((e) => getNftInfo(e)));
											unit = unit.join(' , ');
										}
										showUnit = unit;
										setLoading(false);
									} else if (assetId) {
										setLoading(true);
										foundryData = await IotaSDK.foundry(assetId);
										setLoading(false);
										foundryData = IotaSDK.handleFoundry(foundryData);
										foundryData.tokenId = assetId;
										unit = (foundryData.symbol || '').toLocaleUpperCase();
										showValue = value / Math.pow(10, foundryData.decimals || 0);
										sendAmount = value;
										showUnit = unit;
									} else {
										unit = unit || 'SMR';
										if (!['SMR', 'Glow'].includes(unit)) {
											unit = 'SMR';
										}
										showValue = value;
										sendAmount =
											unit !== 'Glow'
												? Math.pow(10, IotaSDK.curNode?.decimal || 0) * value
												: value;
										showUnit = unit;
									}
								} else {
									unit = unit || 'Mi';
									if (!Unit[unit]) {
										unit = 'Mi';
									}
									showValue = IotaSDK.convertUnits(value, unit, 'Mi');
									sendAmount = IotaSDK.convertUnits(value, unit, 'i');
									showUnit = 'MIOTA';
								}
							}

							let str = I18n.t(abiFunc === 'approve' ? 'apps.approve' : 'apps.send');
							if (abiFunc && abiFunc !== 'approve' && abiFunc !== 'transfer') {
								str = I18n.t('apps.contractFunc')
									.replace('#abiFunc#', abiFunc)
									.replace('#abiParams#', abiParams.join(','));
							}
							let fromStr = I18n.t('apps.sendFrom');
							let forStr = I18n.t('apps.sendFor');
							str = str.replace('#merchant#', merchant ? fromStr + merchant : '');
							str = str.replace('#item_desc#', item_desc ? forStr + item_desc : '');
							str = str.replace('#unit#', showUnit);
							str = str.replace('#fee#', gasFee);
							let texts = str.trim().replace('#address#', address);
							let showValueStr = '';
							if (abiFunc === 'approve') {
								texts = texts.split('#contractAmount#');
								showValueStr = showContractAmount;
							} else {
								texts = texts.split('#amount#');
								showValueStr = showValue;
							}
							texts = [
								{
									text: texts[0]
								},
								{
									text: showValueStr,
									isBold: true
								},
								{
									text: texts[1]
								}
							];
							setDappData({
								texts,
								return_url,
								type,
								amount: sendAmount,
								address,
								taggedData,
								contract,
								foundryData,
								tag,
								nftId,
								abiFunc,
								abiParams,
								gas,
								reqId
							});
							show();
						}
						break;
					case 'dapp':
						break;
					case 'sign':
						{
							if (!content) {
								Toast.error('Required: content');
							}
							let str = I18n.t('apps.sign')
								.trim()
								.replace('#merchant#', merchant ? '\n' + merchant : '')
								.replace('#content#', content);
							const texts = [
								{
									text: str
								}
							];
							setDappData({
								texts,
								return_url,
								type,
								content,
								reqId
							});
							show();
						}
						break;
					case 'iota_changeAccount':
						{
							Toast.showLoading();
							onExecute({ type });
						}
						break;
					case 'iota_connect': // sdk connect
						{
							let str = I18n.t('apps.connect')
								.trim()
								.replace('#origin#', origin || '')
								.replace('#address#', curWallet?.address);
							const texts = [
								{
									text: str
								}
							];
							setDappData({
								texts,
								return_url,
								type,
								origin,
								expires,
								reqId
							});
							show();
						}
						break;
					case 'iota_sign': // sdk sign
						{
							if (!content) {
								return Toast.error('Required: content');
							}
							let str = I18n.t('apps.sign')
								.trim()
								.replace('#merchant#', origin ? '\n' + origin : '')
								.replace('#content#', content);
							const texts = [
								{
									text: str
								}
							];
							setDappData({
								texts,
								return_url,
								type,
								content,
								origin,
								expires,
								reqId
							});
							show();
						}
						break;
					default:
						break;
				}
			}
		}
	};
	useEffect(() => {
		handleUrl(deepLink, curWallet.password);
	}, [JSON.stringify(curWallet), deepLink, curNodeId]);
	useEffect(() => {
		if (canShowDappDialog) {
			Linking.getInitialURL().then((url) => {
				if (/^tanglepay:\/\/.+/.test(url)) {
					setDeepLink(url);
				}
			});
			Linking.addEventListener('url', ({ url }) => {
				if (/^tanglepay:\/\/.+/.test(url)) {
					setDeepLink(url);
				}
			});
		}
	}, [canShowDappDialog]);
	return (
		<Modal
			style={[SS.m0]}
			hasBackdrop
			backdropOpacity={0.3}
			onBackButtonPress={hide}
			onBackdropPress={hide}
			isVisible={isShow}>
			<KeyboardAvoidingView behavior='padding'>
				<View style={[SS.ae, SS.je, SS.w100, SS.h100]}>
					{isLoading && (
						<View style={[SS.pa, SS.w100, SS.h100, SS.c, { zIndex: 10 }]}>
							<Spinner style={{ marginTop: 300 }} />
						</View>
					)}
					<View
						style={[
							SS.bgW,
							SS.w100,
							SS.ph25,
							SS.pv40,
							{ borderTopRightRadius: 16, borderTopLeftRadius: 16 }
						]}>
						<View style={[SS.bgS, SS.radius10, SS.p15, SS.mb45]}>
							<Text>
								{dappData.texts.map((e) => {
									return (
										<Text key={e.text} style={[e.isBold && SS.fw600, { lineHeight: 26 }]}>
											{e.text}
										</Text>
									);
								})}
							</Text>
						</View>
						{['iota_sendTransaction', 'eth_sendTransaction', 'send'].includes(dappData.type) &&
						IotaSDK.checkWeb3Node(curWallet.nodeId) ? (
							<View style={[SS.row, SS.ac, SS.jsb, SS.pv10, SS.mt5]}>
								<Text style={[SS.fz16]}>{I18n.t('assets.estimateGasFee')}</Text>
								<View style={[SS.row, SS.ac]}>
									<Text
										ellipsizeMode='tail'
										numberOfLines={1}
										style={[
											SS.cS,
											SS.fz14,
											SS.fw400,
											SS.tr,
											SS.mr4,
											{ width: ThemeVar.deviceWidth * 0.35 }
										]}>
										{gasInfo.totalEth}
									</Text>
									{gasInfo.totalEth ? (
										<Text style={[SS.cS, SS.fz14, SS.fw400, SS.tr, SS.mr8]}>
											{IotaSDK.curNode?.token}
										</Text>
									) : null}
									<TouchableOpacity
										activeOpacity={0.8}
										onPress={() => {
											if (JSON.stringify(gasInfo) == '{}') {
												return;
											}
											gasDialog.current.show({ ...gasInfo }, (res) => {
												setGasInfo(res);
											});
										}}>
										<Text style={[SS.cP, SS.fz14, SS.fw400]}> {I18n.t('assets.edit')}</Text>
									</TouchableOpacity>
								</View>
							</View>
						) : null}
						{!isBio && dappData.type !== 'iota_connect' && !isLedger && isWalletPassowrdEnabled ? (
							<Item inlineLabel style={[SS.ml0]}>
								<Input
									style={[SS.pl0]}
									keyboardType='ascii-capable'
									secureTextEntry={!showPwd}
									onChangeText={setPassword}
									placeholder={I18n.t('assets.passwordTips')}
								/>
								<SvgIcon
									onPress={() => setShowPwd(!showPwd)}
									name={showPwd ? 'eye_1' : 'eye_0'}
									size={20}
									style={[SS.ml10]}
								/>
							</Item>
						) : null}
						<View style={[SS.row, SS.jsb, SS.ac, SS.mt25, SS.pb20]}>
							<Button
								onPress={() => {
									if (!isBio && dappData.type !== 'iota_connect') {
										onExecute(dappData);
										if (!isNotPrompt) {
											alert.current.show(I18n.t('user.biometriceDialog'), () => {
												const path = 'user/settings';
												Base.push(path);
											});
										}
									} else if (
										(isBio && isWalletPassowrdEnabled) ||
										(!isBio && dappData.type !== 'iota_connect')
									) {
										setPassword(curPwd?.[curWallet.id]);
										rnBiometrics
											.simplePrompt({
												promptMessage: I18n.t('user.bioVerification'),
												cancelButtonText: I18n.t('apps.cancel')
											})
											.then((resultObject) => {
												const { success } = resultObject;
												if (success) {
													console.log('successful biometrics provided');
													Toast.success(
														I18n.t(
															IotaSDK.checkWeb3Node(curWallet.nodeId)
																? 'assets.sendSucc'
																: 'assets.sendSuccRestake'
														)
													);
													setIsPwdInput(true);
													onExecute(dappData);
												} else {
													console.log('user cancelled biometric prompt');
													return Toast.error(I18n.t('user.biometricsFailed'));
												}
											})
											.catch(() => {
												console.log('biometrics failed');
												return Toast.error(I18n.t('user.biometricsFailed'));
											});
									} else {
										onExecute(dappData);
									}
								}}
								small
								rounded
								primary
								style={[{ width: ThemeVar.deviceWidth / 2 - 40, height: 40 }, SS.c]}>
								<Text>
									{I18n.t(dappData.type !== 'iota_connect' ? 'apps.execute' : 'apps.ConnectBtn')}
								</Text>
							</Button>
							<Button
								small
								bordered
								rounded
								dark
								onPress={() => {
									onHandleCancel(dappData);
									hide();
								}}
								style={[
									SS.bgS,
									{ width: ThemeVar.deviceWidth / 2 - 40, height: 40, borderColor: '#D0D1D2' },
									SS.c
								]}>
								<Text>{I18n.t(dappData.abiFunc == 'approve' ? 'apps.reject' : 'apps.cancel')}</Text>
							</Button>
						</View>
					</View>
				</View>
			</KeyboardAvoidingView>
			<BleDevices dialogRef={bleDevices} noModal={false} />
			<GasDialog dialogRef={gasDialog} />
		</Modal>
	);
};
