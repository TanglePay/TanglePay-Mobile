import React, { useRef, useState ,useEffect} from 'react';
import { Container, View, Text, Input, Textarea, Form, Item, Button, Label, Content } from 'native-base';
import { Base, I18n, IotaSDK } from '@tangle-pay/common';
import { Formik } from 'formik';
import { useRoute } from '@react-navigation/native';
import { useAddWallet } from '@tangle-pay/store/common';
import * as Yup from 'yup';
import { useCreateCheck } from '@tangle-pay/store/common';
import { S, SS, Nav, ThemeVar, SvgIcon, Toast } from '@/common';
import { context, setPin, isNewWalletFlow } from '@tangle-pay/domain';
import { ExpDialog } from './expDialog';

const schemaNopassword = Yup.object().shape({
	mnemonic: Yup.string().required(),
	name: Yup.string().required(),
	agree: Yup.bool().isTrue().required()
});

export const AccountIntoPin = () => {
	const dialogRef = useRef();
	const form = useRef();
	const [shouldShowPin, setShouldShowPin] = useState(true);
	useEffect(() => {
		console.log('into pin page',context);
		setShouldShowPin(isNewWalletFlow());
	}, []);
	useCreateCheck((name) => {
		form.current.setFieldValue('name', name);
	});
	const { params } = useRoute();
	const type = params.type;
	const from = params.from;
	const addWallet = useAddWallet();
	return (
		<Container>
			<Nav title={I18n.t(type === 1 ? 'account.intoTitle1' : 'account.intoTitle2')} />
			<Content>
				<Formik
					innerRef={form}
					initialValues={{
						agree: true
					}}
					validateOnBlur={false}
					validateOnChange={false}
					validateOnMount={false}
					validationSchema={schemaNopassword}
					onSubmit={async (values) => {
						//import mnemonics
						if (type === 1) {
							const { password, rePassword } = values;
							if (shouldShowPin) {
								if (!Base.checkPin(password)) {
									return Toast.error(I18n.t('account.intoPinTips'));
								}
								if (password !== rePassword) {
									return Toast.error(I18n.t('account.checkPin'));
								}
								await setPin(password);
							} else {
								values.password = context.state.pin;
								values.rePassword = context.state.pin;
							}
							const res = await IotaSDK.importMnemonic({
								...values
							});
							addWallet({
								...res
							});
							if (from === 'smr') {
								Base.replace('assets/claimReward/claimSMR', {
									id: res.id
								});
							} else {
								Base.popToTop();
								Base.replace('main');
							}
						}
					}}>
					{({ handleChange, handleSubmit, setFieldValue, values, errors }) => (
						<View style={[SS.p16]}>
							<Form>
								{type === 1 ? (
									<View>
										<View style={[SS.row, SS.ac, SS.pb10]}>
											<Text style={[SS.fz14, SS.cS]}>{I18n.t('account.mnemonicTips')}</Text>
											<SvgIcon
												onPress={() => {
													dialogRef.current.show();
												}}
												name='help'
												size={16}
												style={[{ height: 23 }, SS.cS, SS.ml8, SS.mt4]}
											/>
										</View>
										<Textarea
											blurOnSubmit={true}
											returnKeyType='done'
											bordered
											style={[
												S.border(
													4,
													!errors.mnemonic ? ThemeVar.textColor : ThemeVar.brandDanger
												),
												S.radius(10),
												SS.fz14
											]}
											rowSpan={5}
											onChangeText={handleChange('mnemonic')}
											value={values.mnemonic}
										/>
									</View>
								) : (
									<View
										style={[
											SS.radius10,
											SS.mt10,
											S.h(140),
											SS.c,
											S.border(4, !errors.mnemonic ? '#eee' : ThemeVar.brandDanger)
										]}>
										<SvgIcon size={50} name='file' style={[SS.mb20]} />
										<Text>{I18n.t('account.intoSelectFile')}</Text>
									</View>
								)}
								<Text style={[SS.fz14, SS.mt24]}>{I18n.t('account.intoName')}</Text>
								<Item style={[SS.mt8, SS.ml0]} error={!!errors.name}>
									<Input
										style={[SS.fz14, SS.pl0, S.h(44)]}
										placeholder={I18n.t('account.intoNameTips')}
										onChangeText={handleChange('name')}
										value={values.name}
									/>
								</Item>
								{shouldShowPin && (<>
									<Text style={[SS.fz14, SS.mt32]}>
										{I18n.t(type === 1 ? 'account.intoPin' : 'account.intoFilePassword')}
									</Text>								
									<Item style={[SS.mt8, SS.ml0]} error={!!errors.password}>
										<Input
											keyboardType='ascii-capable'
											secureTextEntry
											textContentType={Base.isIos14 ? 'oneTimeCode' : 'none'}
											style={[SS.fz14, SS.pl0, S.h(44)]}
											placeholder={I18n.t(
												type === 1 ? 'account.intoPinTips' : 'account.intoFilePasswordTips'
											)}
											onChangeText={handleChange('password')}
											value={values.password}
										/>
									</Item></>
								)}
								<Input style={[S.h(1)]} />
								{type === 1 && shouldShowPin && (
									<Item style={[SS.ml0, SS.mt8]} error={!!errors.rePassword}>
										<Input
											keyboardType='ascii-capable'
											// secureTextEntry={!Base.isIos14}
											secureTextEntry
											textContentType={Base.isIos14 ? 'oneTimeCode' : 'none'}
											style={[SS.fz14, SS.pl0, S.h(44)]}
											placeholder={I18n.t('account.intoRePin')}
											onChangeText={handleChange('rePassword')}
											value={values.rePassword}
										/>
									</Item>
								)}
							</Form>
							<Form style={[SS.mt40]}>
								<Item
									style={[SS.row, SS.as, SS.ml0, SS.mb40, { borderBottomWidth: 0 }]}
									onPress={() => {
										setFieldValue('agree', !values.agree);
									}}>
									<SvgIcon
										color={values.agree ? ThemeVar.brandPrimary : ThemeVar.textColor}
										size={16}
										style={[SS.mr8, S.marginT(4)]}
										name={values.agree ? 'checkbox_1' : 'checkbox_0'}
									/>
									<View style={[S.w(ThemeVar.deviceWidth - 50)]}>
										<Text
											style={[
												SS.fz14,
												S.tl,
												S.lineHeight(22),
												S.color(!errors.agree ? '#eee' : ThemeVar.brandDanger)
											]}>
											{I18n.t('account.intoAgree')
												.split('##')
												.filter((e) => !!e)
												.map((e, i) => {
													return i % 2 ? (
														<Text
															onPress={() => {
																Base.push(
																	i === 1
																		? 'https://tanglepay.com/terms.html'
																		: 'https://tanglepay.com/policy.html'
																);
															}}
															key={i}
															style={[SS.cP]}>
															{e}
														</Text>
													) : (
														<Text key={i}>{e}</Text>
													);
												})}
										</Text>
									</View>
								</Item>
								<Button block onPress={handleSubmit}>
									<Text>{I18n.t('account.intoBtn')}</Text>
								</Button>
							</Form>
						</View>
					)}
				</Formik>
			</Content>
			<ExpDialog dialogRef={dialogRef} />
		</Container>
	);
};
