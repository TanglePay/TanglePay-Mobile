import React, { useRef } from 'react';
import { Container, View, Text, Input, Textarea, Form, Item, Button, Label, Content } from 'native-base';
import { Base, I18n, IotaSDK } from '@tangle-pay/common';
import { Formik } from 'formik';
import { useAddWallet } from '@tangle-pay/store/common';
import * as Yup from 'yup';
import { useCreateCheck } from '@tangle-pay/store/common';
import { S, SS, Nav, ThemeVar, SvgIcon, Toast } from '@/common';
import { isNewWalletFlow, context, setPin } from '@tangle-pay/domain'

const schema = Yup.object().shape({
	privateKey: Yup.string().required(),
	name: Yup.string().required(),
	password: Yup.string().required(),
	rePassword: Yup.string().required(),
	agree: Yup.bool().isTrue().required()
});
const schemaNopassword = Yup.object().shape({
    privateKey: Yup.string().required(),
    name: Yup.string().required(),
    agree: Yup.bool().isTrue().required()
})
export const AccountIntoPrivateKey = () => {
	const form = useRef();
	const [shouldShowPassword, setShouldShowPassword] = useState(false)
    const [shouldShowPin, setShouldShowPin] = useState(false)
    useEffect(() => {
        setShouldShowPin(context.state.walletCount == 0 || !context.state.isPinSet)
        setShouldShowPassword(!isNewWalletFlow())
    }, [])
	useCreateCheck((name) => {
		form.current.setFieldValue('name', name);
	});
	const addWallet = useAddWallet();
	return (
		<Container>
			<Nav title={I18n.t('account.privateKeyImport')} />
			<Content>
				<Formik
					innerRef={form}
					initialValues={{
						agree: true
					}}
					validateOnBlur={false}
					validateOnChange={false}
					validateOnMount={false}
					validationSchema={shouldShowPin || shouldShowPassword ? schema : schemaNopassword}
					onSubmit={async (values) => {
						const { password, rePassword } = values
                        if (shouldShowPassword) {
                            if (!Base.checkPassword(password)) {
                                return Toast.error(I18n.t('account.intoPasswordTips'))
                            }
                            if (password !== rePassword) {
                                return Toast.error(I18n.t('account.checkPasswrod'))
                            }
                        } else if (shouldShowPin) {
                            if (!Base.checkPin(password)) {
                                return Toast.error(I18n.t('account.intoPinTips'))
                            }
                            if (password !== rePassword) {
                                return Toast.error(I18n.t('account.checkPin'))
                            }
                            await setPin(password)
                        } else {
                            values.password = context.state.pin
                            values.rePassword = context.state.pin
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
						<View style={[SS.p16]}>
							<Form>
								<View>
									<View>
										<Text style={[SS.fz14, SS.pb10, SS.cS]}>
											{I18n.t('account.inputPrivateKey')}
										</Text>
									</View>
									<Textarea
										blurOnSubmit={true}
										returnKeyType='done'
										bordered
										style={[
											S.border(4, !errors.privateKey ? ThemeVar.textColor : ThemeVar.brandDanger),
											S.radius(10),
											SS.fz14
										]}
										rowSpan={5}
										onChangeText={handleChange('privateKey')}
										value={values.privateKey}
									/>
								</View>
								<Text style={[SS.fz14, SS.mt24]}>{I18n.t('account.intoName')}</Text>
								<Item style={[SS.mt8, SS.ml0]} error={!!errors.name}>
									<Input
										style={[SS.fz14, SS.pl0, S.h(44)]}
										placeholder={I18n.t('account.intoNameTips')}
										onChangeText={handleChange('name')}
										value={values.name}
									/>
								</Item>
								{shouldShowPassword && (<>
								<Text style={[SS.fz14, SS.mt24]}>{I18n.t('account.intoPassword')}</Text>
								<Item style={[SS.mt8, SS.ml0]} error={!!errors.password}>
									<Input
										keyboardType='ascii-capable'
										secureTextEntry
										textContentType={Base.isIos14 ? 'oneTimeCode' : 'none'}
										style={[SS.fz14, SS.pl0, S.h(44)]}
										placeholder={I18n.t('account.intoPasswordTips')}
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
										placeholder={I18n.t('account.intoRePasswordTips')}
										onChangeText={handleChange('rePassword')}
										value={values.rePassword}
									/>
								</Item>
								</>)}
								{ shouldShowPin && (<>
								<Label style={[SS.fz14, SS.mt24]}>{I18n.t('account.intoPin')}</Label>
								<Item style={[SS.mt8, SS.ml0]} error={!!errors.password}>
									<MaskedInput
										textContentType={Base.isIos14 ? 'oneTimeCode' : 'none'}
										style={[SS.fz14, SS.pl0, S.h(44)]}
										placeholder={I18n.t('account.intoPinTips')}
										onChangeText={handleChange('password')}
										value={values.password}
									/>
								</Item>
								<Input style={[S.h(1)]} />
								<Item style={[SS.mt8, SS.ml0]} error={!!errors.rePassword}>
									<MaskedInput
										textContentType={Base.isIos14 ? 'oneTimeCode' : 'none'}
										style={[SS.fz14, SS.pl0, S.h(44)]}
										placeholder={I18n.t('account.intoRePin')}
										onChangeText={handleChange('rePassword')}
										value={values.rePassword}
									/>
								</Item></>
                                )}
							</Form>
							<Form style={[SS.mb80, SS.mt40]}>
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
