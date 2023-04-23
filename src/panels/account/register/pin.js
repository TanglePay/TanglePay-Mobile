import React, { useRef, useState, useEffect } from 'react';
import { Container, View, Text, Input, Form, Item, Button, Label, Content } from 'native-base';
import { Base, I18n } from '@tangle-pay/common';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useStore } from '@tangle-pay/store';
import { useCreateCheck } from '@tangle-pay/store/common';
import { S, SS, Nav, ThemeVar, SvgIcon, Toast } from '@/common';
import { context, setPin } from '@tangle-pay/domain'

const getSchema = shouldShowPin => shouldShowPin ? Yup.object().shape({
	name: Yup.string().required(),
	password: Yup.string().required(),
	rePassword: Yup.string().required(),
	agree: Yup.bool().isTrue().required()
}): Yup.object().shape({
	name: Yup.string().required(),
	
	agree: Yup.bool().isTrue().required() 
});
export const AccountRegisterPin = () => {
	const [__, setRegisterInfo] = useStore('common.registerInfo');
	const form = useRef();
    const [shouldShowPin, setShouldShowPin ] = useState( true )
    useEffect(() => {
        console.log(context.state)
        setShouldShowPin(context.state.walletCount == 0 || !context.state.isPinSet)
    }, [])
	useCreateCheck((name) => {
		form.current.setFieldValue('name', name);
	});
	return (
		<Container>
			<Nav title={I18n.t('account.createTitle')} />
			<Content>
				<Formik
					innerRef={form}
					initialValues={{
						agree: true
					}}
					validateOnBlur={false}
					validateOnChange={false}
					validateOnMount={false}
					validationSchema={getSchema(shouldShowPin)}
					onSubmit={async (values) => {
						const { password, rePassword } = values
                        if (shouldShowPin) {
                            if (!Base.checkPin(password)) {
                                return Toast.error(I18n.t('account.intoPasswordTips'))
                            }
                            if (password !== rePassword) {
                                return Toast.error(I18n.t('account.checkPasswrod'))
                            }
                            await setPin(password)
                        }
						setRegisterInfo(Object.assign({},values,{ password:context.state.pin }))
						Base.push('account/backup');
					}}>
					{({ handleChange, handleSubmit, setFieldValue, values, errors }) => (
						<View style={[SS.p16]}>
							<Form>
								<Label style={[SS.fz14, SS.mt10]}>{I18n.t('account.intoName')}</Label>
								<Item style={[SS.mt8, SS.ml0]} error={!!errors.name}>
									<Input
										style={[SS.fz14, SS.pl0, S.h(44)]}
										placeholder={I18n.t('account.intoNameTips')}
										onChangeText={handleChange('name')}
										value={values.name}
									/>
								</Item>
                                { shouldShowPin && (<>
								<Label style={[SS.fz14, SS.mt24]}>{I18n.t('account.intoPin')}</Label>
								<Item style={[SS.mt8, SS.ml0]} error={!!errors.password}>
									<Input
										keyboardType='ascii-capable'
										secureTextEntry
										textContentType={Base.isIos14 ? 'oneTimeCode' : 'none'}
										style={[SS.fz14, SS.pl0, S.h(44)]}
										placeholder={I18n.t('account.intoPinTips')}
										onChangeText={handleChange('password')}
										value={values.password}
									/>
								</Item>
								<Input style={[S.h(1)]} />
								<Item style={[SS.mt8, SS.ml0]} error={!!errors.rePassword}>
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
								</Item></>
                                )}
								<Item
									style={[SS.row, SS.as, SS.ml0, SS.mt20, { borderBottomWidth: 0 }]}
									onPress={() => {
										setFieldValue('agree', !values.agree);
									}}>
									<SvgIcon
										color={values.agree ? ThemeVar.brandPrimary : ThemeVar.textColor}
										size={15}
										style={[SS.mr8, S.marginT(4)]}
										name={values.agree ? 'checkbox_1' : 'checkbox_0'}
									/>
									<View style={[S.w(ThemeVar.deviceWidth - 50)]}>
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
