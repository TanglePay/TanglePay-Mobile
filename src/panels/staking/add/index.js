import React, { useState, useRef } from 'react';
import { Container, Content, View, Text, Form, Item, Input, Button } from 'native-base';
import { Base, I18n, IotaSDK } from '@tangle-pay/common';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useStore } from '@tangle-pay/store';
import { useRoute } from '@react-navigation/native';
import { useGetNodeWallet } from '@tangle-pay/store/common';
import { SS, S, Nav1, AlertDialog, Toast } from '@/common';

const schema = Yup.object().shape({
	// amount: Yup.number().positive().required(),
	password: Yup.string().required()
});
export const StakingAdd = () => {
	const alert = useRef();
	const [assetsList] = useStore('common.assetsList');
	const [currency] = useState('IOTA');
	const [curWallet] = useGetNodeWallet();
	const { params } = useRoute();
	const { tokens, type } = params;
	const assets = assetsList.find((e) => e.name === currency) || {};
	let available = parseFloat(assets.balance) || 0;
	const realBalance = assets.realBalance;
	let titleKey = '';
	// 4->add airdrop
	if ([4].includes(type)) {
		titleKey = 'staking.addAirdropTitle';
	} else if ([1, 2].includes(type)) {
		// 1->stake  2->add amount
		titleKey = 'staking.stake';
	} else {
		// 3->unstake
		titleKey = 'staking.unstake';
	}
	return (
		<Container>
			<Nav1 title={I18n.t(titleKey).replace(/\{name\}/, tokens.map((e) => e.token).join(' , '))} />
			<Content>
				<Formik
					initialValues={{}}
					validateOnBlur={false}
					validateOnChange={false}
					validateOnMount={false}
					validationSchema={schema}
					onSubmit={async (values) => {
						const { password } = values;
						if (password !== curWallet.password) {
							return Toast.error(I18n.t('assets.passwordError'));
						}
						if (available <= 0) {
							return Toast.error(I18n.t('assets.balanceError'));
						}
						const request = async (requestTokens) => {
							Toast.showLoading();
							const res = await IotaSDK.handleStake({
								wallet: curWallet,
								tokens: requestTokens,
								amount: realBalance,
								type
							});
							Toast.hideLoading();
							if (res.code === 0) {
								Base.goBack();
							} else {
								Toast.error(res.msg);
							}
						};

						const limitTokens = tokens.filter((e) => e.limit && e.limit > available);
						if (type === 1 && limitTokens.length > 0) {
							limitTokens.sort((a, b) => a.limit - b.limit);
							const tips = I18n.t('staking.limitAmount')
								.replace('{num}', limitTokens[0].limit)
								.replace('{token}', limitTokens[0].token);
							alert.current.show(tips, () => {
								const requestTokens = tokens.filter((e) => !e.limit || e.limit <= available);
								if (requestTokens.length > 0) {
									setTimeout(() => {
										request(requestTokens);
									}, 600);
								} else {
									Base.goBack();
								}
							});
						} else {
							request(tokens);
						}
					}}>
					{({ handleChange, handleSubmit, values, errors }) => (
						<View style={[SS.ph50, SS.pt10]}>
							<Form>
								<Text style={[SS.fz16, SS.mt25, SS.fw600]}>{I18n.t('assets.password')}</Text>
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
								<View style={[S.marginT(40), SS.pb30]}>
									<Button block onPress={handleSubmit}>
										<Text>{I18n.t('assets.confirm')}</Text>
									</Button>
								</View>
							</Form>
						</View>
					)}
				</Formik>
			</Content>
			<AlertDialog dialogRef={alert} />
		</Container>
	);
};
