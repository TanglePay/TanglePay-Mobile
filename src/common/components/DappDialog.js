import React, { useState, useEffect, useRef } from 'react';
import { Linking, KeyboardAvoidingView, InteractionManager } from 'react-native';
import { View, Text, Item, Input, Button, Spinner } from 'native-base';
import Modal from 'react-native-modal';
import { I18n, IotaSDK, Base } from '@tangle-pay/common';
import { SS, ThemeVar, Toast } from '@/common';
import { useGetNodeWallet, useChangeNode } from '@tangle-pay/store/common';
import { useStore } from '@tangle-pay/store';
import BigNumber from 'bignumber.js';
import { Bridge } from '@/common/bridge';

export const DappDialog = () => {
	const [isShow, setShow] = useState(false);
	const [isLoading, setLoading] = useState(false);
	const [password, setPassword] = useState('');
	const [dappData, setDappData] = useState({
		texts: []
	});
	const [deepLink, setDeepLink] = useState('');
	const selectTimeHandler = useRef();
	const [curWallet] = useGetNodeWallet();
	const [assetsList] = useStore('common.assetsList');
	const [statedAmount] = useStore('staking.statedAmount');
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
	const onExecute = async ({ address, return_url, content, type, amount, origin, expires, taggedData }) => {
		const noPassword = ['iota_connect', 'iota_changeAccount', 'iota_getPublicKey'];
		if (password !== curWallet.password && !noPassword.includes(type)) {
			return Toast.error(I18n.t('assets.passwordError'));
		}
		let messageId = '';
		switch (type) {
			case 'send':
			case 'iota_sendTransaction':
				{
					const assets = assetsList.find((e) => e.name === IotaSDK.curNode?.token) || {};
					let realBalance = BigNumber(assets.realBalance || 0);
					const bigStatedAmount = BigNumber(statedAmount).times(IotaSDK.IOTA_MI);
					realBalance = realBalance.minus(bigStatedAmount);
					let residue = Number(realBalance.minus(amount)) || 0;
					const decimal = Math.pow(10, assets.decimal);
					try {
						if (!IotaSDK.checkWeb3Node(curWallet.nodeId)) {
							if (amount < decimal) {
								return Toast.error(I18n.t('assets.sendBelow1Tips'));
							}
						}
						if (residue < 0) {
							return Toast.error(
								I18n.t(statedAmount > 0 ? 'assets.balanceStakeError' : 'assets.balanceError')
							);
						}
						if (!IotaSDK.checkWeb3Node(curWallet.nodeId)) {
							if (residue < decimal && residue != 0) {
								return Toast.error(I18n.t('assets.residueBelow1Tips'));
							}
						}
						setLoading(true);
						const res = await IotaSDK.send(curWallet, address, amount, {
							contract: assets?.contract,
							token: assets?.name,
							taggedData
						});
						if (!res) {
							setLoading(false);
							return;
						}
						messageId = res.messageId;
						if (type === 'iota_sendTransaction') {
							Bridge.sendMessage(type, res);
						}
						setLoading(false);
						Toast.success(
							I18n.t(
								IotaSDK.checkWeb3Node(curWallet.nodeId) ? 'assets.sendSucc' : 'assets.sendSuccRestake'
							)
						);
						hide();
						const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
						await sleep(2000);
					} catch (error) {
						if (type === 'iota_sendTransaction') {
							Bridge.sendErrorMessage(type, error);
						}
						setLoading(false);
						Toast.error(
							`${error.toString()}---amount:${amount}---residue:${residue}---realBalance:${Number(
								realBalance
							)}---bigStatedAmount:${bigStatedAmount}`,
							{
								duration: 5000
							}
						);
					}
				}
				break;
			case 'sign':
				try {
					messageId = await IotaSDK.iota_sign(curWallet, content);
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
						network: IotaSDK.nodes.find((e) => e.id === curWallet.nodeId)?.network
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
						await Bridge.iota_sign(origin, expires, content);
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
			taggedData = ''
		} = res;
		let toNetId;
		if (network) {
			toNetId = IotaSDK.nodes.find((e) => e.network === network)?.id;
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
				const [type, address] = path.split('/');
				switch (type) {
					case 'send':
					case 'iota_sendTransaction':
						{
							value = parseFloat(value) || 0;
							if (!value) {
								Toast.error('Required: value');
							}
							if (!address) {
								Toast.error('Required: address');
							}

							let showValue = '';
							let showUnit = '';
							let sendAmount = 0;
							if (IotaSDK.checkWeb3Node(toNetId)) {
								unit = unit || 'wei';
								if (IotaSDK.client?.utils) {
									sendAmount = IotaSDK.client.utils.toWei(String(value), unit);
									showValue = IotaSDK.client.utils.fromWei(String(sendAmount), 'ether');
									showUnit = IotaSDK.curNode?.token;
								} else {
									showValue = value;
									showUnit = unit;
									sendAmount = value;
								}
							} else {
								unit = unit || 'i';
								showValue = IotaSDK.convertUnits(value, unit, 'Mi');
								sendAmount = IotaSDK.convertUnits(value, unit, 'i');
								showUnit = 'MIOTA';
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
								taggedData
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
						{dappData.type !== 'iota_connect' && (
							<Item inlineLabel>
								<Input
									keyboardType='ascii-capable'
									secureTextEntry
									onChangeText={setPassword}
									placeholder={I18n.t('assets.passwordTips')}
								/>
							</Item>
						)}
						<View style={[SS.row, SS.jsb, SS.ac, SS.mt25, SS.pb20]}>
							<Button
								onPress={() => {
									onExecute(dappData);
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
