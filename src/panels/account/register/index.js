import React, { useRef } from 'react';
import { Container, View, Text, Input, Form, Item, Button, Label, Content } from 'native-base';
import { StyleSheet, Image } from 'react-native';
import { Base, S, SS, I18n, Nav1, images, ThemeVar, Toast } from '@tangle-pay/common';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useStore } from '@tangle-pay/store';
import { useCreateCheck } from '@tangle-pay/store/common';

const schema = Yup.object().shape({
	name: Yup.string().required(),
	password: Yup.string().required(),
	rePassword: Yup.string().required(),
	agree: Yup.bool().isTrue().required()
});
export const AccountRegister = () => {
	const [__, setRegisterInfo] = useStore('common.registerInfo');
	const form = useRef();
	useCreateCheck((name) => {
		form.current.setFieldValue('name', name);
	});
	return (
		<Container>
			<Nav1 title={I18n.t('account.createTitle')} />
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
					onSubmit={(values) => {
						const { password, rePassword } = values;
						if (!Base.checkPassword(password)) {
							return Toast.error(I18n.t('account.intoPasswordTips'));
						}
						if (password !== rePassword) {
							return Toast.error(I18n.t('account.checkPasswrod'));
						}
						setRegisterInfo(values);
						Base.push('account/backup');
					}}>
					{({ handleChange, handleSubmit, setFieldValue, values, errors }) => (
						<View style={[SS.ph50, SS.pt30]}>
							<Form>
								<Item style={[SS.mt10, SS.ml0]} stackedLabel error={!!errors.name}>
									<Label style={[SS.fz14]}>{I18n.t('account.intoName')}</Label>
									<Input
										style={[SS.fz14, SS.pl0]}
										placeholder={I18n.t('account.intoNameTips')}
										onChangeText={handleChange('name')}
										value={values.name}
									/>
								</Item>
								<Item style={[SS.mt10, SS.ml0]} stackedLabel error={!!errors.password}>
									<Label style={[SS.fz14]}>{I18n.t('account.passwordOptional')}</Label>
									<Input
										keyboardType='ascii-capable'
										secureTextEntry
										textContentType={Base.isIos14 ? 'oneTimeCode' : 'none'}
										style={[SS.fz14, SS.pl0]}
										placeholder={I18n.t('account.intoPasswordTips')}
										onChangeText={handleChange('password')}
										value={values.password}
										// maxLength={20}
									/>
								</Item>
								<Input style={[S.h(1)]} />
								<Item style={[SS.ml0]} error={!!errors.rePassword}>
									<Input
										keyboardType='ascii-capable'
										// secureTextEntry={!Base.isIos14}
										secureTextEntry
										textContentType={Base.isIos14 ? 'oneTimeCode' : 'none'}
										style={[SS.fz14, SS.pl0]}
										placeholder={I18n.t('account.intoRePasswordTips')}
										onChangeText={handleChange('rePassword')}
										value={values.rePassword}
									/>
								</Item>
								<Item
									style={[SS.row, SS.as, SS.ml0, SS.mt20, { borderBottomWidth: 0 }]}
									onPress={() => {
										setFieldValue('agree', !values.agree);
									}}>
									<Image
										source={values.agree ? images.com.checkbox_1 : images.com.checkbox_0}
										style={[S.wh(15), SS.mr10, S.marginT(3)]}
									/>
									<View style={[S.w(ThemeVar.deviceWidth - 120)]}>
										<Text
											style={[
												SS.fz14,
												S.tl,
												S.lineHeight(22),
												S.color(
													!errors.agree ? ThemeVar.textColor : ThemeVar.inputErrorBorderColor
												)
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
								<View style={[S.marginT(100)]}>
									<Button block onPress={handleSubmit}>
										<Text>{I18n.t('account.createTitle')}</Text>
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

const styles = StyleSheet.create({});
