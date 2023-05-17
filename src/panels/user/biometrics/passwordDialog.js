import React, { useState, useImperativeHandle } from 'react';
import { View, Text, Form, Item, Input, Button } from 'native-base';
import { useStore } from '@tangle-pay/store';
import { ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import { I18n, IotaSDK } from '@tangle-pay/common';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useGetNodeWallet } from '@tangle-pay/store/common';
import { S, SS, Toast, SvgIcon } from '@/common';

export const PasswordDialog = ({ dialogRef }) => {
	const [isShow, setShow] = useState(false);
	const [curWallet] = useGetNodeWallet();
	const [showPwd, setShowPwd] = useState(false);
	const [isPwdInput, setIsPwdInput] = useStore('common.pwdInput');
	const [curPwd, setCurPwd] = useStore('common.curPwd');

	useImperativeHandle(
		dialogRef,
		() => {
			return {
				show
			};
		},
		[]
	);
	const show = () => {
		setShow(true);
	};
	const hide = () => {
		setShow(false);
	};
	const setBioPwd = (inputPwd) => {
		const pwd = curPwd ? JSON.parse(JSON.stringify(curPwd)) : {};
		setCurPwd({
			...pwd,
			[curWallet.id]: inputPwd
		});
	};
	const cancel = () => {
		hide();
		setBioPwd('');
	};
	const checkPwd = async (inputPwd) => {
		const isPassword = await IotaSDK.checkPassword(curWallet.seed, inputPwd);
		if (!isPassword) {
			setBioPwd('');
			return Toast.error(I18n.t('assets.passwordError'));
		} else {
			setIsPwdInput(true);
			setBioPwd(inputPwd);
			hide();
			return Toast.success(I18n.t('user.biometricsSucc'));
		}
	};
	return (
		<Modal hasBackdrop backdropOpacity={0.3} onBackButtonPress={cancel} onBackdropPress={cancel} isVisible={isShow}>
			<View style={[SS.w100, SS.radius10, SS.bgW]}>
				<Text style={[SS.pv12, SS.ph16, SS.fz16, SS.fw600, S.border(2)]}>
					{I18n.t('user.enableBiometrics')}
				</Text>
				<ScrollView contentContainerStyle={[SS.p16]}>
					<Formik
						initialValues={{
							pwd: ''
						}}
						isValidating={true}
						validationSchema={Yup.object().shape({
							pwd: Yup.string().required()
						})}
						onSubmit={(values) => {
							checkPwd(values.pwd);
						}}>
						{({ handleChange, handleSubmit, values, errors }) => (
							<Form>
								<Text style={[SS.fz16]}>{I18n.t('assets.passwordTips')}</Text>
								<Item style={[SS.mt10, SS.ml0, { minHeight: 50 }]}>
									<Input
										secureTextEntry={!showPwd}
										style={[SS.fz14]}
										placeholder={I18n.t('assets.password')}
										onChangeText={handleChange('pwd')}
										value={values.pwd}
									/>
									<SvgIcon
										onPress={() => setShowPwd(!showPwd)}
										name={showPwd ? 'eye_1' : 'eye_0'}
										size={20}
										style={[SS.ml10]}
									/>
								</Item>
								<View style={[S.marginT(24), SS.row]}>
									<Button
										bordered
										style={[SS.flex1, SS.c, { marginHorizontal: 10 }]}
										onPress={cancel}>
										<Text>{I18n.t('apps.cancel')}</Text>
									</Button>
									<Button style={[SS.flex1, SS.c, { marginHorizontal: 10 }]} onPress={handleSubmit}>
										<Text>{I18n.t('assets.confirm')}</Text>
									</Button>
								</View>
							</Form>
						)}
					</Formik>
				</ScrollView>
			</View>
		</Modal>
	);
};
