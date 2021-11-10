import React, { useRef } from 'react';
import { Container, View, Text, Input, Textarea, Form, Item, Button, Label, Content } from 'native-base';
import { Image } from 'react-native';
import { Base, S, SS, I18n, Nav1, images, ThemeVar, IotaSDK, Toast } from '@/common';
import { Formik } from 'formik';
import { useRoute } from '@react-navigation/native';
import { useAddWallet } from '@/store/common';
import * as Yup from 'yup';
import { useCreateCheck } from '@/store/common';

const schema = Yup.object().shape({
	mnemonic: Yup.string().required(),
	name: Yup.string().required(),
	password: Yup.string().required(),
	rePassword: Yup.string().required(),
	agree: Yup.bool().isTrue().required()
});
export const AccountInto = () => {
	const form = useRef();
	useCreateCheck((name) => {
		form.current.setFieldValue('name', name);
	});
	const { params } = useRoute();
	const type = params.type;
	const addWallet = useAddWallet();
	return (
		<Container>
			<Nav1 title={I18n.t(type === 1 ? 'account.intoTitle1' : 'account.intoTitle2')} />
			<Content>
				<Formik
					innerRef={form}
					initialValues={{
						agree: true
					}}
					validateOnBlur={false}
					validateOnChange={false}
					validateOnMount={false}
					validationSchema={schema}
					onSubmit={async (values) => {
						//import mnemonics
						if (type === 1) {
							const { password, rePassword } = values;
							if (!Base.checkPassword(password)) {
								return Toast.error(I18n.t('account.intoPasswordTips'));
							}
							if (password !== rePassword) {
								return Toast.error(I18n.t('account.checkPasswrod'));
							}
							const res = await IotaSDK.importMnemonic({
								...values
							});
							addWallet({
								...res
							});
							Base.popToTop();
							Base.replace('main');
						}
					}}>
					{({ handleChange, handleSubmit, setFieldValue, values, errors }) => (
						<View style={[SS.ph20, SS.jsb, S.h(ThemeVar.contentHeight1)]}>
							<Form>
								{type === 1 ? (
									<View>
										<View>
											<Text style={[SS.fz14, SS.pb10, SS.tc, SS.cS]}>
												{I18n.t('account.mnemonicTips')}
											</Text>
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
											S.border(4, ThemeVar.textColor),
											SS.radius10,
											SS.mt10,
											S.h(140),
											SS.c,
											S.border(4, !errors.mnemonic ? ThemeVar.textColor : ThemeVar.brandDanger)
										]}>
										<Image style={[S.wh(42, 49), SS.mb20]} source={images.com.file} />
										<Text>{I18n.t('account.intoSelectFile')}</Text>
									</View>
								)}
								<Item style={[SS.mt15, SS.ml0]} stackedLabel error={!!errors.name}>
									<Label style={[SS.fz14]}>{I18n.t('account.intoName')}</Label>
									<Input
										style={[SS.fz14, SS.pl0]}
										placeholder={I18n.t('account.intoNameTips')}
										onChangeText={handleChange('name')}
										value={values.name}
									/>
								</Item>
								<Item style={[SS.mt15, SS.ml0]} stackedLabel error={!!errors.password}>
									<Label style={[SS.fz14]}>
										{I18n.t(type === 1 ? 'account.intoPassword' : 'account.intoFilePassword')}
									</Label>
									<Input
										keyboardType='ascii-capable'
										secureTextEntry
										style={[SS.fz14, SS.pl0]}
										placeholder={I18n.t(
											type === 1 ? 'account.intoPasswordTips' : 'account.intoFilePasswordTips'
										)}
										onChangeText={handleChange('password')}
										value={values.password}
									/>
								</Item>
								{type === 1 && (
									<Item style={[SS.ml0]} error={!!errors.rePassword}>
										<Input
											keyboardType='ascii-capable'
											secureTextEntry={!Base.isIos14}
											style={[SS.fz14, SS.pl0]}
											placeholder={I18n.t('account.intoRePasswordTips')}
											onChangeText={handleChange('rePassword')}
											value={values.rePassword}
										/>
									</Item>
								)}
							</Form>
							<Form style={[SS.mb80]}>
								<Item
									style={[SS.row, SS.as, SS.ml0, SS.mb40, { borderBottomWidth: 0 }]}
									onPress={() => {
										setFieldValue('agree', !values.agree);
									}}>
									<Image
										source={values.agree ? images.com.checkbox_1 : images.com.checkbox_0}
										style={[S.wh(15), SS.mr10, S.marginT(3)]}
									/>
									<View style={[S.w(ThemeVar.deviceWidth - 70)]}>
										<Text
											style={[
												SS.fz14,
												S.tl,
												S.lineHeight(22),
												S.color(!errors.agree ? ThemeVar.textColor : ThemeVar.brandDanger)
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
																		? 'http://tanglepay.com/terms.html'
																		: 'http://tanglepay.com/policy.html'
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
		</Container>
	);
};
