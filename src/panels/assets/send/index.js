import React, { useEffect, useState, useRef } from 'react';
import { Container, Content, View, Text, Form, Item, Input, Button } from 'native-base';
import { Base, I18n, IotaSDK } from '@tangle-pay/common';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useStore } from '@tangle-pay/store';
import { useRoute } from '@react-navigation/native';
import { useGetNodeWallet, useUpdateBalance } from '@tangle-pay/store/common';
import { Nav1, S, SS, SvgIcon, Toast } from '@/common';

const schema = Yup.object().shape({
	// currency: Yup.string().required(),
	receiver: Yup.string().required(),
	amount: Yup.number().positive().required(),
	password: Yup.string().required()
});
export const AssetsSend = () => {
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
	let available = parseFloat(assets.balance - statedAmount) || 0;
	if (available < 0) {
		available = 0;
	}
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
						const { password, amount, receiver } = values;
						if (password !== curWallet.password) {
							return Toast.error(I18n.t('assets.passwordError'));
						}
						let residue = available - parseFloat(amount);
						residue = residue || 0;
						if (parseFloat(amount) < 1) {
							return Toast.error(I18n.t('assets.sendBelow1Tips'));
						}
						if (residue < 0) {
							return Toast.error(I18n.t('assets.balanceError'));
						}
						if (residue < 1 && residue != 0) {
							return Toast.error(I18n.t('assets.residueBelow1Tips'));
						}
						Toast.showLoading();
						try {
							await IotaSDK.send(curWallet, receiver, amount);
							Toast.hideLoading();
							Toast.success(I18n.t('assets.sendSucc'));
							Base.goBack();
							updateBalance((assets.balance - parseInt(amount)) * IotaSDK.IOTA_MI, curWallet.address);
						} catch (error) {
							console.log(error);
							Toast.hideLoading();
							Toast.error(I18n.t('assets.sendError'));
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
											setFieldValue('amount', (parseFloat(values.amount) || 0).toString());
										}}
									/>
									<Text style={[SS.fz14, SS.cS]}>
										{I18n.t('assets.balance')} {Base.formatNum(available)} {assets.unit}
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
