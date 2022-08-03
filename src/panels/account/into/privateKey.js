import React, { useRef } from 'react';
import { Container, View, Text, Input, Textarea, Form, Item, Button, Label, Content } from 'native-base';
import { Base, I18n, IotaSDK } from '@tangle-pay/common';
import { Formik } from 'formik';
import { useAddWallet } from '@tangle-pay/store/common';
import * as Yup from 'yup';
import { useCreateCheck } from '@tangle-pay/store/common';
import { S, SS, Nav, ThemeVar, SvgIcon, Toast } from '@/common';

const schema = Yup.object().shape({
	privateKey: Yup.string().required(),
	name: Yup.string().required(),
	password: Yup.string().required(),
	rePassword: Yup.string().required(),
	agree: Yup.bool().isTrue().required()
});
export const AccountIntoPrivateKey = () => {
	const form = useRef();
	useCreateCheck((name) => {
		form.current.setFieldValue('name', name);
	});
	const addWallet = useAddWallet();
	return (
		<Container>
			<Nav title={I18n.t('account.intoBtn')} />
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
						const { password, rePassword } = values;
						if (!Base.checkPassword(password)) {
							return Toast.error(I18n.t('account.intoPasswordTips'));
						}
						if (password !== rePassword) {
							return Toast.error(I18n.t('account.checkPasswrod'));
						}
						const res = await IotaSDK.importPrivateKey({
							...values
						});
						addWallet({
							...res
						});
						Base.popToTop();
						Base.replace('main');
					}}>
					{({ handleChange, handleSubmit, setFieldValue, values, errors }) => (
						<View style={[SS.p16, SS.jsb, S.h(ThemeVar.contentHeight1)]}>
							<Form>
								<View>
									<View>
										<Text style={[SS.fz24, SS.fw600, SS.mb8]}>
											{I18n.t('account.privateKeyImport')}
										</Text>
										<Text style={[SS.fz14, SS.pb16, SS.cS]}>
											{I18n.t('account.inputPrivateKey')}
										</Text>
									</View>
									<Textarea
										blurOnSubmit={true}
										returnKeyType='done'
										bordered
										style={[
											{ borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0 },
											S.border(2, !errors.privateKey ? '#eee' : ThemeVar.brandDanger, 1),
											SS.fz14,
											SS.ph0,
											SS.pl0,
											SS.mt0,
											SS.pt0,
											SS.pb8
										]}
										rowSpan={2}
										onChangeText={handleChange('privateKey')}
										value={values.privateKey}
									/>
								</View>
								<Item style={[SS.mt24, SS.ml0]} stackedLabel error={!!errors.name}>
									<Label style={[SS.fz14]}>{I18n.t('account.intoName')}</Label>
									<Input
										style={[SS.fz14, SS.pl0, SS.pv32]}
										placeholder={I18n.t('account.intoNameTips')}
										onChangeText={handleChange('name')}
										value={values.name}
									/>
								</Item>
								<Item style={[SS.mt24, SS.ml0]} stackedLabel error={!!errors.password}>
									<Label style={[SS.fz14]}>{I18n.t('account.intoPassword')}</Label>
									<Input
										keyboardType='ascii-capable'
										secureTextEntry
										textContentType={Base.isIos14 ? 'oneTimeCode' : 'none'}
										style={[SS.fz14, SS.pl0, SS.pv32]}
										placeholder={I18n.t('account.intoPasswordTips')}
										onChangeText={handleChange('password')}
										value={values.password}
									/>
								</Item>
								<Input style={[S.h(1)]} />
								<Item style={[SS.ml0]} error={!!errors.rePassword}>
									<Input
										keyboardType='ascii-capable'
										// secureTextEntry={!Base.isIos14}
										secureTextEntry
										textContentType={Base.isIos14 ? 'oneTimeCode' : 'none'}
										style={[SS.fz14, SS.pl0, SS.pv32]}
										placeholder={I18n.t('account.intoRePasswordTips')}
										onChangeText={handleChange('rePassword')}
										value={values.rePassword}
									/>
								</Item>
							</Form>
							<Form style={[SS.mb80]}>
								<Item
									style={[SS.row, SS.as, SS.ml0, SS.mb40, { borderBottomWidth: 0 }]}
									onPress={() => {
										setFieldValue('agree', !values.agree);
									}}>
									<SvgIcon
										color={values.agree ? ThemeVar.brandPrimary : ThemeVar.textColor}
										size={15}
										style={[SS.mr8, S.marginT(3)]}
										name={values.agree ? 'checkbox_1' : 'checkbox_0'}
									/>
									<View style={[S.w(ThemeVar.deviceWidth - 70)]}>
										<Text
											style={[
												SS.fz12,
												SS.fw600,
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
																		? 'https://tanglepay.com/terms.html'
																		: 'https://tanglepay.com/policy.html'
																);
															}}
															key={i}
															style={[SS.cP, SS.fw600]}>
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
