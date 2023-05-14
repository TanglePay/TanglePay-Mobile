import React, { useEffect, useState, useRef } from 'react';
import { Container, Content, View, Text, Form, Item, Input, Button } from 'native-base';
import { Base, I18n, IotaSDK } from '@tangle-pay/common';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useStore } from '@tangle-pay/store';
import { useRoute } from '@react-navigation/native';
import { useGetNodeWallet, useGetAssetsList } from '@tangle-pay/store/common';
import { Nav, S, SS, SvgIcon, Toast, ConfirmDialog, ThemeVar } from '@/common';
import ReactNativeBiometrics from 'react-native-biometrics';
import BigNumber from 'bignumber.js';
import { useGetParticipationEvents } from '@tangle-pay/store/staking';
import { Image, TouchableOpacity } from 'react-native';
import { GasDialog } from '@/common/components/gasDialog';
import { BleDevices } from '@/common/components/bleDevices';
import { context, checkWalletIsPasswordEnabled } from '@tangle-pay/domain';

const schema = Yup.object().shape({
	// currency: Yup.string().required(),
	receiver: Yup.string().required(),
	amount: Yup.number().positive().required(),
	password: Yup.string().required()
});
const schemaNopassword = Yup.object().shape({
	receiver: Yup.string().required(),
	amount: Yup.number().positive().required(),
	password: Yup.string().optional()
});
const rnBiometrics = new ReactNativeBiometrics();

export const AssetsSend = () => {
	useGetParticipationEvents();
	// const [statedAmount] = useStore('staking.statedAmount');
	const [assetsList] = useStore('common.assetsList');
	const [isBio] = useStore('common.biometrics');
	const [isPwdInput, setIsPwdInput] = useStore('common.pwdInput');
	const [isNotPrompt] = useStore('common.bioPrompt');
	const [curPwd, setCurPwd] = useStore('common.curPwd');
	const [showPwd, setShowPwd] = useState(false);
	const { params } = useRoute();
	const form = useRef();
	const [inputAmount, setInputAmount] = useState('');
	const alert = useRef();
	const gasDialog = useRef();
	const bleDevices = useRef();
	let currency = params?.currency;
	const assetsId = params?.id;
	const nftId = params?.nftId;
	const nftImg = params?.nftImg;
	currency = currency || assetsList?.[0]?.name;
	const [curWallet] = useGetNodeWallet();
	let assets = assetsList.find((e) => e.name === currency) || {};
	if (assetsId) {
		assets = assetsList.find((e) => e.tokenId === assetsId || e.contract === assetsId) || {};
	}
	const setReceiver = (receiver) => {
		form.current.setFieldValue('receiver', receiver);
	};
	const [isWalletPassowrdEnabled, setIsWalletPassowrdEnabled] = useState(true);
	useEffect(() => {
		checkWalletIsPasswordEnabled(curWallet.id).then((res) => {
			setIsWalletPassowrdEnabled(res);
		});
	}, [curWallet.id]);
	useEffect(() => {
		setReceiver(params?.address);
	}, [params]);
	const [gasInfo, setGasInfo] = useState({});
	useEffect(() => {
		if (IotaSDK.checkWeb3Node(curWallet.nodeId)) {
			const amount = parseFloat(inputAmount) || 0;
			let decimal = Math.pow(10, assets.decimal);
			let sendAmount = Number(BigNumber(amount).times(decimal));
			sendAmount = IotaSDK.getNumberStr(sendAmount || 0);
			const eth = IotaSDK.client.eth;
			Promise.all([
				eth.getGasPrice(),
				IotaSDK.getDefaultGasLimit(curWallet.address, assets?.contract, sendAmount)
			]).then(([gasPrice, gas]) => {
				if (assets?.contract) {
					if (IotaSDK.curNode?.contractGasPriceRate) {
						gasPrice = IotaSDK.getNumberStr(parseInt(gasPrice * IotaSDK.curNode?.contractGasPriceRate));
					}
					if (IotaSDK.curNode?.contractGasLimitRate) {
						gas = IotaSDK.getNumberStr(parseInt(gas * IotaSDK.curNode?.contractGasLimitRate));
					}
				} else {
					if (IotaSDK.curNode?.gasPriceRate) {
						gasPrice = IotaSDK.getNumberStr(parseInt(gasPrice * IotaSDK.curNode?.gasPriceRate));
					}
					if (IotaSDK.curNode?.gasLimitRate) {
						gas = IotaSDK.getNumberStr(parseInt(gas * IotaSDK.curNode?.gasLimitRate));
					}
				}
				// let gasLimit = gasInfo.gasLimit || gas;
				let gasLimit = gas;
				let totalWei = new BigNumber(gasPrice).times(gasLimit);
				totalWei = IotaSDK.getNumberStr(totalWei.valueOf());
				const totalEth = IotaSDK.client.utils.fromWei(totalWei, 'ether');
				const gasPriceWei = gasPrice;
				gasPrice = IotaSDK.client.utils.fromWei(gasPrice, 'gwei');
				const total = IotaSDK.client.utils.fromWei(totalWei, 'gwei');
				setGasInfo({
					gasLimit,
					gasPrice,
					total,
					totalEth,
					gasPriceWei
				});
			});
		}
	}, [curWallet.nodeId, assets?.contract, inputAmount, assets.decimal]);
	useGetAssetsList(curWallet);
	const isLedger = curWallet.type == 'ledger';
	// const bigStatedAmount = BigNumber(statedAmount).times(IotaSDK.IOTA_MI);
	let realBalance = BigNumber(assets.realBalance || 0);
	if (IotaSDK.checkSMR(curWallet.nodeId) && !assets.isSMRToken) {
		realBalance = BigNumber(assets.realAvailable || 0);
	}
	if (Number(realBalance) < 0) {
		realBalance = BigNumber(0);
	}
	let available = Base.formatNum(IotaSDK.getNumberStr(Number(realBalance.div(Math.pow(10, assets.decimal)))));

	return (
		<Container>
			<Nav title={I18n.t('assets.send')} />
			<Content>
				<Formik
					innerRef={form}
					initialValues={nftId ? { amount: '1' } : {}}
					validateOnBlur={false}
					validateOnChange={false}
					validateOnMount={false}
					validationSchema={isLedger || !isWalletPassowrdEnabled ? schemaNopassword : schema}
					onSubmit={async (values) => {
						let { password, amount, receiver } = values;
						if (!isWalletPassowrdEnabled) {
							password = context.state.pin;
						}
						if (!isLedger) {
							if (isWalletPassowrdEnabled && isBio) {
								password = curPwd;
								try {
									const resultObject = await rnBiometrics.simplePrompt({
										promptMessage: I18n.t('user.bioVerification'),
										cancelButtonText: I18n.t('apps.cancel')
									});
									if (resultObject.success) {
										password = curPwd;
									} else {
										return Toast.error(I18n.t('user.biometricsFailed'));
									}
								} catch (error) {
									return Toast.error(I18n.t('user.biometricsFailed'));
								}
							} else {
								const isPassword = await IotaSDK.checkPassword(curWallet.seed, password);
								if (!isBio && !isPassword) {
									return Toast.error(I18n.t('assets.passwordError'));
								} else {
									setCurPwd(password);
								}
							}
						}

						amount = parseFloat(amount) || 0;
						let decimal = Math.pow(10, assets.decimal);
						let sendAmount = Number(BigNumber(amount).times(decimal));
						let residue = Number(realBalance.minus(sendAmount)) || 0;
						if (!IotaSDK.checkWeb3Node(curWallet.nodeId) && !IotaSDK.checkSMR(curWallet.nodeId)) {
							if (sendAmount < IotaSDK.IOTA_MI) {
								return Toast.error(I18n.t('assets.sendBelow1Tips'));
							}
						}
						if (residue < 0) {
							return Toast.error(I18n.t('assets.balanceError'));
						}
						if (!IotaSDK.checkWeb3Node(curWallet.nodeId) && !IotaSDK.checkSMR(curWallet.nodeId)) {
							if (residue < Number(BigNumber(0.01).times(IotaSDK.IOTA_MI))) {
								sendAmount = Number(realBalance);
							} else if (residue < IotaSDK.IOTA_MI && residue != 0) {
								return Toast.error(I18n.t('assets.residueBelow1Tips'));
							}
						}
						const tokenId = assets?.tokenId;
						Toast.showLoading();
						try {
							let mainBalance = 0;
							if (tokenId) {
								mainBalance = assetsList.find((e) => e.name === IotaSDK.curNode?.token)?.realBalance;
							}
							// nft
							if (nftId) {
								amount = 1;
								sendAmount = 1;
								residue = 0;
								realBalance = 0;
								decimal = 0;
							}
							if (isLedger) {
								await bleDevices.current.show();
							}
							const res = await IotaSDK.send({ ...curWallet, password }, receiver, sendAmount, {
								contract: assets?.contract,
								token: assets?.name,
								residue,
								realBalance: Number(realBalance),
								awaitStake: true,
								tokenId: assets?.tokenId,
								decimal: assets?.decimal,
								mainBalance,
								nftId,
								gas: gasInfo.gasLimit,
								gasPrice: gasInfo.gasPriceWei
							});
							Toast.hideLoading();
							if (res) {
								Toast.success(
									I18n.t(
										IotaSDK.checkWeb3Node(curWallet.nodeId)
											? 'assets.sendSucc'
											: 'assets.sendSuccRestake'
									)
								);
								if (isBio === false && !isNotPrompt) {
									alert.current.show(I18n.t('user.biometriceDialog'), () => {
										const path = 'user/setting';
										Base.push(path);
									});
								} else {
									Base.goBack();
								}
							}
						} catch (error) {
							console.log(error);
							Toast.hideLoading();
							Toast.error(error.toString());
							// Toast.error(
							// 	`${error.toString()}---input:${
							// 		values.amount
							// 	}---amount:${amount}---sendAmount:${sendAmount}---residue:${residue}---realBalance:${Number(
							// 		realBalance
							// 	)}---available:${available}`,
							// 	{
							// 		duration: 5000
							// 	}
							// );
						}
					}}>
					{({ handleChange, handleSubmit, setFieldValue, values, errors }) => (
						<View style={[SS.p16]}>
							<Form>
								<Item
									style={[SS.ml0, SS.row, SS.ac, SS.jsb, { minHeight: 40 }]}
									error={!!errors.currency}>
									<View style={[SS.row, SS.ac]}>
										<Text>{nftId ? 'NFT' : I18n.t('assets.currency')}</Text>
										{nftId ? (
											<Image
												style={[
													SS.ml12,
													{
														borderRadius: 4,
														width: 30,
														height: 30
													}
												]}
												source={{ uri: nftImg }}
											/>
										) : null}
									</View>
									<View style={[SS.row, SS.ac]}>
										<Text numberOfLines={1} style={[SS.fz14, SS.cS, { maxWidth: 180 }]}>
											{currency}
										</Text>
										{/* <Image style={[S.wh(16), SS.ml10]} source={images.com.right} /> */}
									</View>
								</Item>
								<View style={[SS.row, SS.ac, SS.jsb, SS.mt24]}>
									<Text style={[SS.fz16]}>{I18n.t('assets.receiver')}</Text>
									<SvgIcon
										onPress={() => {
											Base.push('assets/scan', {
												setReceiver
											});
										}}
										name='scan'
										size={20}
									/>
								</View>
								<Item style={[SS.ml0, SS.mt8]} stackedLabel error={!!errors.receiver}>
									<Input
										numberOfLines={2}
										multiline
										blurOnSubmit={true}
										returnKeyType='done'
										style={[SS.fz14, SS.pl0, SS.pb0, S.h(44)]}
										placeholder={I18n.t('assets.receiverTips')}
										onChangeText={handleChange('receiver')}
										value={values.receiver}
									/>
								</Item>
								{!nftId ? (
									<>
										<Text style={[SS.fz16, SS.mt24]}>{I18n.t('assets.amount')}</Text>
										<Item style={[SS.ml0, SS.mt8]} error={!!errors.amount}>
											<Input
												keyboardType='numeric'
												style={[SS.fz14, SS.pl0, S.h(44)]}
												placeholder={I18n.t('assets.amountTips')}
												onChangeText={handleChange('amount')}
												value={values.amount}
												onBlur={() => {
													let precision = assets.decimal;
													if (precision > 6) {
														precision = 6;
													}
													let str = Base.formatNum(values.amount, precision);
													if (parseFloat(str) < Math.pow(10, -precision)) {
														str = String(Math.pow(10, -precision));
													}
													setFieldValue('amount', str);
													setInputAmount(str);
												}}
											/>
											<Text style={[SS.fz14, SS.cS]}>
												{I18n.t('staking.available')} {available} {assets.unit}
											</Text>
										</Item>
									</>
								) : null}
								{IotaSDK.checkWeb3Node(curWallet.nodeId) ? (
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
													{ maxWidth: ThemeVar.deviceWidth * 0.4 }
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
								{isBio || isLedger || !isWalletPassowrdEnabled ? (
									<View />
								) : (
									<View>
										<Text style={[SS.fz16, SS.mt25]}>{I18n.t('assets.password')}</Text>
										<Item style={[SS.ml0, { minHeight: 50 }]} error={!!errors.password}>
											<Input
												keyboardType='ascii-capable'
												secureTextEntry={!showPwd}
												style={[SS.fz14, SS.pl0]}
												placeholder={I18n.t('assets.passwordTips')}
												onChangeText={handleChange('password')}
												value={values.password}
											/>
											<SvgIcon
												onPress={() => setShowPwd(!showPwd)}
												name={showPwd ? 'eye_1' : 'eye_0'}
												size={20}
												style={[SS.ml10]}
											/>
										</Item>
									</View>
								)}
								<View style={[S.marginT(100), SS.pb30]}>
									<Button block onPress={handleSubmit}>
										<Text>{I18n.t('assets.confirm')}</Text>
									</Button>
								</View>
							</Form>
						</View>
					)}
				</Formik>
			</Content>
			<ConfirmDialog dialogRef={alert} />
			<GasDialog dialogRef={gasDialog} />
			<BleDevices dialogRef={bleDevices} />
		</Container>
	);
};
