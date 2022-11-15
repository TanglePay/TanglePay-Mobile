import React, { useState, useEffect, useRef } from 'react';
import { Linking, KeyboardAvoidingView, InteractionManager } from 'react-native';
import { View, Text, Item, Input, Button, Spinner } from 'native-base';
import Modal from 'react-native-modal';
import { I18n, IotaSDK, Base } from '@tangle-pay/common';
import { SS, ThemeVar, Toast, SvgIcon, ConfirmDialog } from '@/common';
import { useGetNodeWallet, useChangeNode } from '@tangle-pay/store/common';
import { useStore } from '@tangle-pay/store';
import BigNumber from 'bignumber.js';
import { Bridge } from '@/common/bridge';
import { useGetParticipationEvents } from '@tangle-pay/store/staking';
import ReactNativeBiometrics from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();
export const DappDialog = () => {
	const [isShow, setShow] = useState(false);
	const [isLoading, setLoading] = useState(false);
	useGetParticipationEvents();
	const [password, setPassword] = useState('');
	const [showPwd, setShowPwd] = useState(false);
	const [isBio] = useStore('common.biometrics');
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
	const show = () => {
		requestAnimationFrame(() => {
			setShow(true);
		});
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
		foundryData
	}) => {
		const noPassword = ['iota_connect', 'iota_changeAccount', 'iota_getPublicKey'];
		if (!noPassword.includes(type)) {
			const isPassword = await IotaSDK.checkPassword(curWallet.seed, password);
			if (!isPassword) {
				return Toast.error(I18n.t('assets.passwordError'));
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
					const decimal = Math.pow(10, assets.decimal);
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
						const res = await IotaSDK.send({ ...curWallet, password }, address, amount, {
							contract: assets?.contract,
							token: assets?.name,
							taggedData,
							realBalance: Number(realBalance),
							residue,
							tokenId: foundryData?.tokenId,
							decimal: assets?.decimal,
							mainBalance,
							awaitStake: true
						});
						if (!res) {
							setLoading(false);
							return;
						}
						messageId = res.messageId;
						if (type === 'iota_sendTransaction' || type === 'eth_sendTransaction') {
							Bridge.sendMessage(type, res);
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
							Bridge.sendErrorMessage(type, error);
						}
						setLoading(false);
						Toast.error(error.toString());
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
					await Bridge.sendMessage(type, {
						address: curWallet.address,
						nodeId: curWallet.nodeId,
						network: IotaSDK.nodes.find((e) => e.id == curWallet.nodeId)?.network
					});
					Toast.hideLoading();
				}
				break;
			case 'iota_connect':
				{
					InteractionManager.runAfterInteractions(async () => {
						await Bridge.iota_connect(origin, expires);
					});
				}
				break;
			case 'iota_sign':
				{
					InteractionManager.runAfterInteractions(async () => {
						await Bridge.iota_sign(origin, expires, content, password);
					});
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
		if (!url) return;
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
			assetId = ''
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
							value = parseFloat(value) || 0;
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
							if (IotaSDK.checkWeb3Node(toNetId || curNodeId)) {
								let curToken = IotaSDK.curNode?.token;
								if (taggedData) {
									contract = address;
									unit = 'wei';
									value = `0x${taggedData.slice(-64).replace(/^0+/, '')}`;
									value = IotaSDK.client?.utils.hexToNumberString(value) || 0;
									address = `0x${taggedData.slice(-(64 + 40), -64)}`;
									curToken =
										(IotaSDK.curNode.contractList || []).find((e) => e.contract === contract)
											?.token || IotaSDK.curNode?.token;
								}
								unit = unit || 'wei';
								if (IotaSDK.client?.utils) {
									sendAmount = IotaSDK.client.utils.toWei(String(value), unit);
									showValue = IotaSDK.client.utils.fromWei(String(sendAmount), 'ether');
									showUnit = curToken;
								} else {
									showValue = value;
									showUnit = unit;
									sendAmount = value;
								}
							} else {
								if (IotaSDK.checkSMR(toNetId || curNodeId)) {
									if (assetId) {
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
										showValue = value;
										sendAmount =
											unit !== 'Glow'
												? Math.pow(10, IotaSDK.curNode?.decimal || 0) * value
												: value;
										showUnit = unit;
									}
								} else {
									unit = unit || 'Mi';
									showValue = IotaSDK.convertUnits(value, unit, 'Mi');
									sendAmount = IotaSDK.convertUnits(value, unit, 'i');
									showUnit = 'MIOTA';
								}
							}

							let str = I18n.t('apps.send');
							let fromStr = I18n.t('apps.sendFrom');
							let forStr = I18n.t('apps.sendFor');
							str = str.replace('#merchant#', merchant ? fromStr + merchant : '');
							str = str.replace('#item_desc#', item_desc ? forStr + item_desc : '');
							str = str.replace('#unit#', showUnit);
							let texts = str.trim().replace('#address#', address);
							texts = texts.split('#amount#');
							texts = [
								{
									text: texts[0]
								},
								{
									text: showValue,
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
								foundryData
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
								content
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
								expires
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
								expires
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
	}, []);
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
						{!isBio && dappData.type !== 'iota_connect' && (
							<Item inlineLabel>
								<Input
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
						)}
						<View style={[SS.row, SS.jsb, SS.ac, SS.mt25, SS.pb20]}>
							<Button
								onPress={() => {
									if (!isBio && dappData.type !== 'iota_connect') {
										onExecute(dappData);
										if (!isNotPrompt) {
											alert.current.show(I18n.t('user.biometriceDialog'), () => {
												const path = 'user/biometrics';
												Base.push(path);
											});
										}
									} else if (isBio && dappData.type !== 'iota_connect') {
										setPassword(curPwd);
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
													// onExecute(dappData);
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
								<Text>{I18n.t('apps.cancel')}</Text>
							</Button>
						</View>
					</View>
				</View>
			</KeyboardAvoidingView>
		</Modal>
	);
};
