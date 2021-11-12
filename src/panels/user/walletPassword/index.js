import React from 'react';
import { Container, Content, View, Text, Input, Form, Item, Button, Label } from 'native-base';
import { StyleSheet } from 'react-native';
import { Base, S, SS, I18n, Nav, Toast } from '@tangle-pay/common';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useRoute } from '@react-navigation/native';
import { useEditWallet } from '@tangle-pay/store/common';

const schema = Yup.object().shape({
	old: Yup.string().required(),
	newPassword: Yup.string().required(),
	rePassword: Yup.string().required()
	// agree: Yup.bool().required()
});
export const UserWalletPassword = () => {
	const editWallet = useEditWallet();
	const { params } = useRoute();
	return (
		<Container>
			<Nav title={I18n.t('user.resetPassword')} />
			<Content>
				<Formik
					initialValues={{}}
					validateOnBlur={false}
					validateOnChange={false}
					validateOnMount={false}
					validationSchema={schema}
					onSubmit={(values) => {
						if (params.password !== values.old) {
							return Toast.error(I18n.t('user.passwordError'));
						}
						const { newPassword, rePassword } = values;
						if (!Base.checkPassword(newPassword)) {
							return Toast.error(I18n.t('account.intoPasswordTips'));
						}
						if (newPassword !== rePassword) {
							return Toast.error(I18n.t('account.checkPasswrod'));
						}
						editWallet(params.id, { password: values.newPassword }, true);
						Toast.success(I18n.t('user.passwordSucc'));
						Base.goBack();
					}}>
					{({ handleChange, handleSubmit, setFieldValue, values, errors }) => (
						<View style={[SS.p20]}>
							<Form>
								<Text style={[SS.fz16, SS.mt25]}>{I18n.t('user.old')}</Text>
								<Item style={[SS.ml0, { minHeight: 50 }]} stackedLabel error={!!errors.old}>
									<Input
										keyboardType='ascii-capable'
										secureTextEntry
										style={[SS.fz14]}
										placeholder={I18n.t('user.oldTips')}
										onChangeText={handleChange('old')}
										value={values.old}
									/>
								</Item>
								<Text style={[SS.fz16, SS.mt25]}>{I18n.t('user.new')}</Text>
								<Item style={[SS.ml0, { minHeight: 50 }]} error={!!errors.newPassword}>
									<Input
										keyboardType='ascii-capable'
										secureTextEntry={!Base.isIos14}
										style={[SS.fz14]}
										placeholder={I18n.t('user.newTips')}
										onChangeText={handleChange('newPassword')}
										value={values.newPassword}
									/>
								</Item>
								<Item style={[SS.ml0, { minHeight: 50 }]} error={!!errors.rePassword}>
									<Input
										keyboardType='ascii-capable'
										secureTextEntry={!Base.isIos14}
										style={[SS.fz14]}
										placeholder={I18n.t('user.repeatPassword')}
										onChangeText={handleChange('rePassword')}
										value={values.rePassword}
									/>
								</Item>
								{/* <Item
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
											S.tl,
											S.lineHeight(22),
											S.color(!errors.agree ? ThemeVar.textColor : ThemeVar.inputErrorBorderColor)
										]}>
										{I18n.t('user.exportNewFile')}
									</Text>
								</View>
							</Item> */}
								<View style={[S.marginT(100)]}>
									<Button block onPress={handleSubmit}>
										<Text>{I18n.t('user.resetPassword')}</Text>
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
