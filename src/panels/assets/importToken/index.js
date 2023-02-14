import React, { useRef, useState } from 'react';
import { Container, View, Text, Input, Form, Item, Button, Label, Content } from 'native-base';
import { Base, I18n, IotaSDK } from '@tangle-pay/common';
import { TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useStore } from '@tangle-pay/store';
import { useCreateCheck } from '@tangle-pay/store/common';
import { S, SS, Nav, ThemeVar, SvgIcon, Toast } from '@/common';

const schema = Yup.object().shape({
	contract: Yup.string().required(),
	symbol: Yup.string().required(),
	decimal: Yup.string().required()
});
export const ImportToken = () => {
	const form = useRef();
	const [curTab, setTab] = useState(0);
	const [searchStr, setSearch] = useState('');
	return (
		<Container>
			<Nav title={I18n.t('assets.importToken')} />
			<Content>
				<View style={[SS.flex, SS.ac, SS.row, S.border(2), SS.ph16]}>
					<TouchableOpacity
						onPress={() => setTab(0)}
						activeOpacity={0.8}
						style={[SS.c, SS.mr12, { height: 50 }]}>
						<Text
							style={[
								S.color(curTab === 0 ? ThemeVar.brandPrimary : ThemeVar.textColor),
								SS.fz16,
								SS.fw500
							]}>
							{I18n.t('assets.search')}
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => setTab(1)}
						activeOpacity={0.8}
						style={[SS.c, SS.mr12, { height: 60 }]}>
						<Text
							style={[
								S.color(curTab === 1 ? ThemeVar.brandPrimary : ThemeVar.textColor),
								SS.fz16,
								SS.fw600
							]}>
							{I18n.t('assets.customTokens')}
						</Text>
					</TouchableOpacity>
				</View>
				{curTab == 0 ? (
					<View style={[SS.p16]}>
						<View style={[{ height: 48, padding: 6 }, SS.row, SS.ac, SS.bgS, SS.radius10]}>
							<SvgIcon name='search' color='#ccc' size='20' />
							<Input
								style={[SS.fz16, SS.fw400, { height: 24 }, SS.pv0]}
								value={searchStr}
								onChangeText={setSearch}
								placeholder='Search Tokens'
							/>
						</View>
						<View style={[SS.row, { marginTop: 56 }]}>
							<Button
								block
								primary
								bordered
								style={[SS.mr16, SS.flex1]}
								onPress={() => {
									Base.goBack();
								}}>
								<Text>{I18n.t('apps.cancel')}</Text>
							</Button>
							<Button
								block
								primary
								style={[SS.flex1]}
								onPress={async () => {
									if (searchStr) {
										try {
											const web3Contract = IotaSDK.getContract(searchStr);
											if (web3Contract) {
												Toast.showLoading();
												const symbol = await web3Contract.methods.symbol().call();
												const decimal = await web3Contract.methods.decimals().call();
												Toast.hideLoading();
												IotaSDK.importContract(searchStr, symbol, decimal);
												Base.goBack();
												IotaSDK.refreshAssets();
											} else {
												Toast.hideLoading();
												Toast.show(I18n.t('assets.inputRightContract'));
											}
										} catch (error) {
											Toast.hideLoading();
											Toast.show(I18n.t('assets.inputRightContract'));
										}
									}
								}}>
								<Text>{I18n.t('assets.importBtn')}</Text>
							</Button>
						</View>
					</View>
				) : null}
				{curTab == 1 ? (
					<View>
						<Formik
							innerRef={form}
							initialValues={{}}
							validateOnBlur={false}
							validateOnChange={false}
							validateOnMount={false}
							validationSchema={schema}
							onSubmit={async (values) => {
								const { contract, symbol, decimal } = values;
								try {
									const web3Contract = IotaSDK.getContract(contract);
									if (web3Contract) {
										IotaSDK.importContract(contract, symbol, decimal);
										Base.goBack();
										IotaSDK.refreshAssets();
									} else {
										Toast.show(I18n.t('assets.inputRightContract'));
									}
								} catch (error) {
									Toast.show(error.toString());
								}
							}}>
							{({ handleChange, handleSubmit, setFieldValue, values, errors }) => (
								<View style={[SS.p16]}>
									<Form>
										<Label style={[SS.fz14, SS.mt10]}>
											{I18n.t('assets.tokenContractAddress')}
										</Label>
										<Item style={[SS.mt8, SS.ml0]} error={!!errors.contract}>
											<Input
												style={[SS.fz16, SS.pl0, S.h(44)]}
												placeholder={I18n.t('assets.inputContractAddress')}
												onChangeText={handleChange('contract')}
												value={values.contract}
												onBlur={async () => {
													if (values.contract) {
														try {
															const web3Contract = IotaSDK.getContract(values.contract);
															if (web3Contract) {
																const symbol = await web3Contract.methods
																	.symbol()
																	.call();
																const decimal = await web3Contract.methods
																	.decimals()
																	.call();
																setFieldValue('symbol', String(symbol));
																setFieldValue('decimal', String(decimal));
															}
														} catch (error) {}
													}
												}}
											/>
										</Item>
										<Label style={[SS.fz16, SS.mt24]}>{I18n.t('assets.tokenSymbol')}</Label>
										<Item style={[SS.mt8, SS.ml0]} error={!!errors.symbol}>
											<Input
												style={[SS.fz16, SS.pl0, S.h(44)]}
												placeholder={I18n.t('assets.inputTokenSymbol')}
												onChangeText={handleChange('symbol')}
												value={values.symbol}
											/>
										</Item>
										<Label style={[SS.fz16, SS.mt24]}>{I18n.t('assets.tokenDecimal')}</Label>
										<Item style={[SS.mt8, SS.ml0]} error={!!errors.decimal}>
											<Input
												keyboardType='numeric'
												style={[SS.fz16, SS.pl0, S.h(44)]}
												placeholder={I18n.t('assets.inputTokenDecimal')}
												onChangeText={handleChange('decimal')}
												value={values.decimal}
											/>
										</Item>
										<View style={[S.marginT(56)]}>
											<Button block onPress={handleSubmit}>
												<Text>{I18n.t('assets.confirm')}</Text>
											</Button>
										</View>
									</Form>
								</View>
							)}
						</Formik>
					</View>
				) : null}
			</Content>
		</Container>
	);
};
