import React, { useEffect, useState, useRef } from 'react';
import { Container, Content, View, Text, Form, Item, Input, Button } from 'native-base';
import { Base, I18n, IotaSDK } from '@tangle-pay/common';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useStore } from '@tangle-pay/store';
import { useRoute } from '@react-navigation/native';
import { useGetNodeWallet, useUpdateBalance } from '@tangle-pay/store/common';
import { Nav1, S, SS, SvgIcon, Toast } from '@/common';
import BigNumber from 'bignumber.js';

const schema = Yup.object().shape({
	// currency: Yup.string().required(),
	receiver: Yup.string().required(),
	amount: Yup.number().positive().required(),
	password: Yup.string().required()
});
export const AssetsSend = () => {
	console.log(IotaSDK.convertUnits(10000, 'i', 'Mi'));
	const [statedAmount] = useStore('staking.statedAmount');
	const updateBalance = useUpdateBalance();
	const [assetsList] = useStore('common.assetsList');
	const { params } = useRoute();
	const form = useRef();
	const [currency] = useState('IOTA');
	const [curWallet] = useGetNodeWallet();
	const assets = assetsList.find((e) => e.name === currency) || {};
	const setReceiver = (receiver) => {
		form.current.setFieldValue('receiver', receiver);
	};
	useEffect(() => {
		setReceiver(params?.address);
	}, [params]);

	const bigStatedAmount = BigNumber(statedAmount).times(IotaSDK.IOTA_MI);
	let realBalance = BigNumber(assets.realBalance || 0).minus(bigStatedAmount);
	if (Number(realBalance) < 0) {
		realBalance = BigNumber(0);
	}
	let available = Base.formatNum(realBalance.div(IotaSDK.IOTA_MI), 6);
	return (
		<Container>
			<Nav1 title={I18n.t('assets.send')} />
			<Content>
				<Formik
					innerRef={form}
					initialValues={{}}
					validateOnBlur={false}
					validateOnChange={false}
					validateOnMount={false}
					validationSchema={schema}
					onSubmit={async (values) => {
						let { password, amount, receiver } = values;
						if (password !== curWallet.password) {
							return Toast.error(I18n.t('assets.passwordError'));
						}

						amount = parseFloat(amount) || 0;
						let sendAmount = Number(BigNumber(amount).times(IotaSDK.IOTA_MI));
						let residue = Number(realBalance.minus(sendAmount)) || 0;
						if (sendAmount < IotaSDK.IOTA_MI) {
							return Toast.error(I18n.t('assets.sendBelow1Tips'));
						}
						if (residue < 0) {
							return Toast.error(
								I18n.t(statedAmount > 0 ? 'assets.balanceStakeError' : 'assets.balanceError')
							);
						}
						if (residue < Number(BigNumber(0.01).times(IotaSDK.IOTA_MI))) {
							sendAmount = Number(realBalance);
						} else if (residue < IotaSDK.IOTA_MI && residue != 0) {
							return Toast.error(I18n.t('assets.residueBelow1Tips'));
						}
						Toast.showLoading();
						try {
							await IotaSDK.send(curWallet, receiver, sendAmount);
							Toast.hideLoading();
							Toast.success(I18n.t('assets.sendSucc'));
							Base.goBack();
							updateBalance(Number(bigStatedAmount.plus(residue)), curWallet.address);
						} catch (error) {
							console.log(error);
							Toast.hideLoading();
							Toast.error(
								`${error.toString()}---input:${
									values.amount
								}---amount:${amount}---sendAmount:${sendAmount}---residue:${residue}---realBalance:${Number(
									realBalance
								)}---available:${available}---bigStatedAmount:${bigStatedAmount}`
							);
						}
					}}>
					{({ handleChange, handleSubmit, setFieldValue, values, errors }) => (
						<View style={[SS.ph50, SS.pt30]}>
							<Form>
								<Item
									style={[SS.ml0, SS.row, SS.ac, SS.jsb, { minHeight: 40 }]}
									error={!!errors.currency}>
									<Text>{I18n.t('assets.currency')}</Text>
									<View style={[SS.row, SS.ac]}>
										<Text style={[SS.fz14, SS.cS]}>IOTA</Text>
										{/* <Image style={[S.wh(16), SS.ml10]} source={images.com.right} /> */}
									</View>
								</Item>
								<View style={[SS.row, SS.ac, SS.jsb, SS.mt25, SS.mb5]}>
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
								<Item style={[SS.ml0, { minHeight: 45 }]} stackedLabel error={!!errors.receiver}>
									<Input
										numberOfLines={2}
										multiline
										blurOnSubmit={true}
										returnKeyType='done'
										style={[SS.fz14, SS.pl0, SS.pb0]}
										placeholder={I18n.t('assets.receiverTips')}
										onChangeText={handleChange('receiver')}
										value={values.receiver}
									/>
								</Item>
								<Text style={[SS.fz16, SS.mt25]}>{I18n.t('assets.amount')}</Text>
								<Item style={[SS.ml0, { minHeight: 50 }]} error={!!errors.amount}>
									<Input
										keyboardType='numeric'
										style={[SS.fz14, SS.pl0]}
										placeholder={I18n.t('assets.amountTips')}
										onChangeText={handleChange('amount')}
										value={values.amount}
										onBlur={() => {
											const precision = Math.log10(IotaSDK.IOTA_MI);
											let str = Base.formatNum(values.amount, precision);
											if (parseFloat(str) < Math.pow(10, -precision)) {
												str = String(Math.pow(10, -precision));
											}
											setFieldValue('amount', str);
										}}
									/>
									<Text style={[SS.fz14, SS.cS]}>
										{I18n.t('assets.balance')} {available} {assets.unit}
									</Text>
								</Item>
								{/* <Item
									style={[SS.mt20, SS.ml0, SS.row, SS.jsb, SS.ac, { minHeight: 40 }]}
									error={!!errors.amount}>
									<Text style={[SS.fz16]}>{I18n.t('assets.balance')}</Text>
									<Text style={[SS.fz14, SS.cS]}>
										{assets.balance} {assets.unit} IOTA
									</Text>
								</Item> */}
								<Text style={[SS.fz16, SS.mt25]}>{I18n.t('assets.password')}</Text>
								<Item style={[SS.ml0, { minHeight: 50 }]} error={!!errors.password}>
									<Input
										keyboardType='ascii-capable'
										secureTextEntry
										style={[SS.fz14, SS.pl0]}
										placeholder={I18n.t('assets.passwordTips')}
										onChangeText={handleChange('password')}
										value={values.password}
									/>
								</Item>
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
		</Container>
	);
};
