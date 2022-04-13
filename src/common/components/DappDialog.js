import React, { useState, useEffect, useRef } from 'react';
import { Linking, KeyboardAvoidingView } from 'react-native';
import { View, Text, Item, Input, Button, Spinner } from 'native-base';
import Modal from 'react-native-modal';
import { I18n, IotaSDK, Base } from '@tangle-pay/common';
import { SS, ThemeVar, Toast } from '@/common';
import { useGetNodeWallet, useChangeNode, useUpdateBalance } from '@tangle-pay/store/common';
import { useStore } from '@tangle-pay/store';
import BigNumber from 'bignumber.js';
import Clipboard from '@react-native-clipboard/clipboard';

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
	const updateBalance = useUpdateBalance();
	const [assetsList] = useStore('common.assetsList');
	const assets = assetsList.find((e) => e.name === 'IOTA') || {};
	const [statedAmount] = useStore('staking.statedAmount');
	const [curNodeId, , dispatch] = useStore('common.curNodeId');
	const changeNode = useChangeNode(dispatch);
	const show = () => {
		requestAnimationFrame(() => {
			setShow(true);
		});
	};
	const hide = () => {
		setShow(false);
		setLoading(false);
	};
	const onExecute = async ({ address, return_url, content, type, amount }) => {
		if (password !== curWallet.password) {
			return Toast.error(I18n.t('assets.passwordError'));
		}
		let messageId = '';
		switch (type) {
			case 'send':
				{
					let realBalance = BigNumber(assets.realBalance || 0);
					const bigStatedAmount = BigNumber(statedAmount).times(IotaSDK.IOTA_MI);
					realBalance = realBalance.minus(bigStatedAmount);
					let residue = Number(realBalance.minus(amount)) || 0;
					try {
						if (amount < IotaSDK.IOTA_MI) {
							return Toast.error(I18n.t('assets.sendBelow1Tips'));
						}
						if (residue < 0) {
							return Toast.error(I18n.t('assets.balanceError'));
						}
						if (residue < IotaSDK.IOTA_MI && residue != 0) {
							return Toast.error(I18n.t('assets.residueBelow1Tips'));
						}
						setLoading(true);
						const res = await IotaSDK.send(curWallet, address, amount);
						messageId = res.messageId;
						setLoading(false);
						Toast.success(I18n.t('assets.sendSucc'));
						hide();
						updateBalance(residue, curWallet.address);
					} catch (error) {
						setLoading(false);
						Toast.error(
							`${error.toString()}---amount:${amount}---residue:${residue}---realBalance:${Number(
								realBalance
							)}---bigStatedAmount:${bigStatedAmount}`
						);
					}
				}
				break;
			case 'sign':
				try {
					const residue = Number(assets.realBalance || 0);
					if (residue < IotaSDK.IOTA_MI) {
						return Toast.error(I18n.t('assets.balanceError'));
					}
					setLoading(true);
					const res = await IotaSDK.sign(content, curWallet, residue);
					messageId = res.messageId;
					setLoading(false);
				} catch (error) {
					setLoading(false);
					Toast.error(error.toString());
				}
				break;
			default:
				break;
		}
		if (messageId && return_url) {
			return_url = decodeURIComponent(return_url);
			const url = `${return_url}${/\?/.test(return_url) ? '&' : '?'}message_id=${messageId}`;
			const route = Base.navigator?.getCurrentRoute();
			Clipboard.setString(url);
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
		let { network, value, unit, return_url, item_desc = '', merchant = '', content = '' } = res;
		unit = unit || 'i';
		const toNetId = IotaSDK.nodes.find((e) => e.apiPath === network)?.id;
		if (toNetId && parseInt(toNetId) !== parseInt(curNodeId)) {
			await changeNode(toNetId);
			return;
		} else if (!curWallet.address) {
			selectTimeHandler.current = setTimeout(() => {
				Base.push('assets/wallets');
			}, 500);
		} else {
			setDeepLink('');
			clearTimeout(selectTimeHandler.current);
			const path = url.replace('tanglepay://', '').split('?')[0];
			if (path) {
				const [type, address] = path.split('/');
				switch (type) {
					case 'send':
						{
							value = parseFloat(value) || 0;
							if (!value) {
								Toast.error('Required: value');
							}
							if (!address) {
								Toast.error('Required: address');
							}
							let str = I18n.t('apps.send');
							let fromStr = I18n.t('apps.sendFrom');
							let forStr = I18n.t('apps.sendFor');
							str = str.replace('#merchant#', merchant ? fromStr + merchant : '');
							str = str.replace('#item_desc#', item_desc ? forStr + item_desc : '');
							let texts = str.trim().replace('#address#', address);
							texts = texts.split('#amount#');
							texts = [
								{
									text: texts[0]
								},
								{
									text: IotaSDK.convertUnits(value, unit, 'Mi'),
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
								amount: IotaSDK.convertUnits(value, unit, 'i'),
								address
							});
							show();
						}
						break;
					case 'dapp':
						break;
					case 'sign':
						{
							console.log(content, '======');
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
					default:
						break;
				}
			}
		}
	};
	useEffect(() => {
		handleUrl(deepLink);
	}, [curWallet.address, deepLink]);
	useEffect(() => {
		Linking.getInitialURL().then((url) => {
			setDeepLink(url);
		});
		Linking.addEventListener('url', ({ url }) => {
			setDeepLink(url);
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
						<Item inlineLabel>
							<Input
								keyboardType='ascii-capable'
								secureTextEntry
								onChangeText={setPassword}
								placeholder={I18n.t('assets.passwordTips')}
							/>
						</Item>
						<View style={[SS.row, SS.jsb, SS.ac, SS.mt25, SS.pb20]}>
							<Button
								onPress={() => {
									onExecute(dappData);
								}}
								small
								rounded
								primary
								style={[{ width: ThemeVar.deviceWidth / 2 - 40 }, SS.c]}>
								<Text>{I18n.t('apps.execute')}</Text>
							</Button>
							<Button
								small
								bordered
								rounded
								dark
								onPress={hide}
								style={[
									SS.bgS,
									{ width: ThemeVar.deviceWidth / 2 - 40, borderColor: '#D0D1D2' },
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
