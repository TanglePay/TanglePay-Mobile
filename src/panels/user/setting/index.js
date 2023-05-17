import React, { useEffect, useState, useRef } from 'react';
import { Container, Content, View, Text, Switch } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { Base, I18n, IotaSDK } from '@tangle-pay/common';
import { useStore } from '@tangle-pay/store';
import { S, SS, Nav, SvgIcon, Toast } from '@/common';
import { ImageCache } from 'react-native-img-cache';
import RNFetchBlob from 'rn-fetch-blob';
import _sumBy from 'lodash/sumBy';
import { useChangeNode, useGetNodeWallet } from '@tangle-pay/store/common';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import { PasswordDialog } from '../biometrics/passwordDialog';
import { context, checkWalletIsPasswordEnabled } from '@tangle-pay/domain';

const rnBiometrics = new ReactNativeBiometrics();

export const UserSetting = () => {
	useStore('common.lang');
	const changeNode = useChangeNode();
	const [curWallet] = useGetNodeWallet();
	const [disTrace, setDisTrace] = useStore('common.disTrace');
	const [isNoRestake, setNoRestake] = useState(false);
	const [cache, setCache] = useState('0 M');
	const [isBio, setIsBio] = useState(false);
	const dialogRef = useRef();
	const [isPwdInput] = useStore('common.pwdInput');
	const [curPwd, setCurPwd] = useStore('common.curPwd');
	const [isWalletPassowrdEnabled, setIsWalletPassowrdEnabled] = useState(true);
	useEffect(() => {
		checkWalletIsPasswordEnabled(curWallet.id).then((res) => {
			setIsWalletPassowrdEnabled(res);
		});
		setIsBio((curPwd || {})[curWallet.id] ? true : false);
	}, [curWallet.id, JSON.stringify(curPwd)]);
	const [biometrics, setBiometrics] = useState({
		touchId: false,
		faceId: false,
		biometrics: false
	}); // device supports
	const [bioSupport, setBioSupport] = useState(false);
	const list = [
		{
			icon: 'lang',
			label: I18n.t('user.language'),
			path: 'user/lang'
		},
		{
			icon: 'cache',
			label: I18n.t('nft.clearCache'),
			value: cache,
			onPress: () => {
				ImageCache.get().clear();
				getCache();
			}
		},
		{
			icon: 'privacy',
			label: I18n.t('user.privacy'),
			tips: I18n.t('user.privacyTips'),
			type: 'switch',
			value: disTrace == 1,
			onChange: (e) => setDisTrace(e ? 1 : 0)
		},
		{
			icon: 'stake',
			label: I18n.t('staking.restake'),
			type: 'switch',
			value: isNoRestake,
			onChange: (e) => {
				setNoRestake(e);
				Base.setLocalData('common.isNoRestake', e ? 0 : 1);
			}
		},
		{
			icon: 'fingerprint',
			label: I18n.t('user.biometrics'),
			type: 'switch',
			value: isBio,
			disabled: !curWallet?.id || !bioSupport,
			onChange: (e) => {
				console.log('on bio change', e);
				bioSwitchChange();
			}
		},
		{
			icon: 'advanced',
			label: 'Test Mode',
			path: 'user/advanced',
			size: 22
		},
		{
			icon: 'pin',
			label: context.state.isPinSet ? I18n.t('account.resetPinTitle') : I18n.t('account.setPinButton'),
			path: context.state.isPinSet ? 'account/pin/reset' : 'account/pin/set',
			size: 22
		}
	];
	const curNodeKey = IotaSDK?.curNode?.curNodeKey;

	if (curNodeKey) {
		list.push({
			icon: 'network',
			label: I18n.t('user.network'),
			value: curNodeKey,
			hideArrow: true,
			onPress: async () => {
				const curNodeId = IotaSDK?.curNode?.id;
				Toast.showLoading();
				try {
					await IotaSDK.getNodes();
					if (curNodeId) {
						Toast.hideLoading();
						await changeNode(curNodeId);
						IotaSDK.refreshAssets();
					}
					Toast.hideLoading();
				} catch (error) {
					Toast.hideLoading();
				}
			}
		});
	}
	useEffect(() => {
		Base.getLocalData('common.isNoRestake').then((res) => {
			setNoRestake(res != 1);
		});
		getCache();
		rnBiometrics
			.isSensorAvailable()
			.then((resultObject) => {
				const { available, biometryType } = resultObject;
				const availableBiometrics = {
					touchId: false,
					faceId: false,
					biometrics: false
				};
				if (available && biometryType === BiometryTypes.TouchID) {
					availableBiometrics.touchId = true;
					setBioSupport(true);
					console.log('TouchID is supported');
				} else if (available && biometryType === BiometryTypes.FaceID) {
					availableBiometrics.faceId = true;
					setBioSupport(true);
					console.log('FaceID is supported');
				} else if (available && biometryType === BiometryTypes.Biometrics) {
					availableBiometrics.biometrics = true;
					setBioSupport(true);
					console.log('Biometrics is supported');
				} else {
					console.log('Biometrics is not supported');
					setBioSupport(false);
					Toast.error(I18n.t('user.biometricsFailed')); //NOT Support
				}
				setBiometrics(availableBiometrics);
			})
			.catch(() => {
				console.log('biometrics failed');
				Toast.error(I18n.t('user.biometricsFailed'));
			});
	}, []);
	const getCache = async () => {
		const { cache } = ImageCache.get();
		const requestList = [];
		for (const i in cache) {
			const path = cache[i].path;
			requestList.push(RNFetchBlob.fs.stat(path));
		}
		const list = await Promise.all(requestList);
		const totalSize = _sumBy(list, 'size');
		setCache(Base.formatNum(totalSize / 1024 / 1024) + ' M');
	};
	const bioSwitchChange = () => {
		if (isBio) {
			setIsBio(false);
			const pwd = curPwd ? JSON.parse(JSON.stringify(curPwd)) : {};
			setCurPwd({
				...pwd,
				[curWallet.id]: ''
			});
		} else {
			rnBiometrics
				.simplePrompt({
					promptMessage: I18n.t('user.bioVerification')
					// cancelButtonText: I18n.t('apps.cancel')
					// fallbackPromptMessage: I18n.t('apps.cancel'),
				})
				.then((resultObject) => {
					const { success } = resultObject;
					if (success) {
						console.log('successful biometrics provided');
						setIsBio(true);
						// if (!isPwdInput && isWalletPassowrdEnabled) {
						// 	dialogRef.current.show();
						// } else if (!isWalletPassowrdEnabled) {
						// 	setCurPwd(context.state.pin);
						// }
						if (isWalletPassowrdEnabled) {
							dialogRef.current.show();
						} else {
							// setCurPwd(context.state.pin);
							const pwd = curPwd ? JSON.parse(JSON.stringify(curPwd)) : {};
							setCurPwd({
								...pwd,
								[curWallet.id]: context.state.pin
							});
						}
					} else {
						console.log('user cancelled biometric prompt');
					}
				})
				.catch(() => {
					console.log('biometrics failed');
					Toast.error(I18n.t('user.biometricsFailed'));
					setIsBio(false);
				});
		}
	};
	return (
		<Container>
			<Nav title={I18n.t('user.setting')} />
			<Content>
				<View>
					{list.map((e, i) => {
						return (
							<TouchableOpacity
								activeOpacity={0.8}
								onPress={() => {
									if (e.onPress) {
										e.onPress();
									} else if (e.path) {
										Base.push(e.path);
									}
								}}
								key={i}
								style={[SS.row, SS.ac, SS.jsb, SS.p16, S.border(2)]}>
								<View style={[SS.row, SS.ac]}>
									<View style={[SS.c, { minWidth: 24 }]}>
										<SvgIcon name={e.icon} size={e.size || 24} color='#000' />
									</View>
									<Text style={[SS.fz16, SS.ml12]}>{e.label}</Text>
									{e.tips && <Text style={[SS.fz11, SS.ml10, SS.cS, SS.mt5]}>{e.tips}</Text>}
								</View>
								{e.type === 'switch' ? (
									<Switch
										value={e.value}
										onValueChange={e.onChange}
										disabled={e.disabled == null ? false : e.disabled}
									/>
								) : (
									<View style={[SS.row, SS.ac]}>
										{e.value && <Text style={[SS.fz13, SS.cS]}>{e.value}</Text>}
										{!e.hideArrow ? (
											<View style={[SS.ml10]}>
												<SvgIcon size={16} name='right' />
											</View>
										) : null}
									</View>
								)}
							</TouchableOpacity>
						);
					})}
				</View>
			</Content>
			<PasswordDialog dialogRef={dialogRef} />
		</Container>
	);
};
