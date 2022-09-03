import React, { useState, useImperativeHandle, useRef } from 'react';
import { View, Text, Form, Item, Input, Button } from 'native-base';
import { ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import { I18n, IotaSDK } from '@tangle-pay/common';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useEditWallet } from '@tangle-pay/store/common';
import { useSelectWallet } from '@tangle-pay/store/common';
import { S, SS } from '@/common';

export const PasswordDialog = ({ dialogRef }) => {
	const [isShow, setShow] = useState(false);
	const [curWallet, setCurWallet] = useState({});
	const callBackRef = useRef();
	const formRef = useRef();
	const editWallet = useEditWallet();
	const selectWallet = useSelectWallet();
	useImperativeHandle(
		dialogRef,
		() => {
			return {
				show
			};
		},
		[]
	);
	const show = (wallet, callBack) => {
		callBackRef.current = callBack;
		if (formRef.current) {
			formRef.current.setFieldValue('password', '');
		}
		setShow(true);
		setCurWallet(wallet);
	};
	const hide = (info) => {
		setShow(false);
		callBackRef.current && callBackRef.current({ ...info });
		if (!info) {
			// clear password selection given invalid password input
			selectWallet('');
		}
	};
	return (
		<Modal
			hasBackdrop
			backdropOpacity={0.3}
			onBackButtonPress={() => hide()}
			onBackdropPress={() => hide()}
			isVisible={isShow}>
			<View style={[SS.w100, SS.radius10, SS.bgW]}>
				<ScrollView contentContainerStyle={[SS.p16]}>
					<Formik
						innerRef={formRef}
						initialValues={{}}
						isValidating={true}
						validateOnBlur={false}
						validateOnChange={false}
						validateOnMount={false}
						validationSchema={Yup.object().shape({
							password: Yup.string().required()
						})}
						onSubmit={async (values) => {
							const { password } = values;
							const isPassword = await IotaSDK.checkPassword(curWallet.seed, password);
							if (!isPassword) {
								return Toast.error(I18n.t('assets.passwordError'));
							}
							const obj = {
								...curWallet,
								oldPassword: password,
								password
							};
							editWallet(curWallet.id, { ...obj });
							hide(obj);

							// v1->v2 start
							if (!IotaSDK.checkKeyAndIvIsV2(curWallet.seed)) {
								setTimeout(() => {
									editWallet(curWallet.id, { ...obj }, true);
								}, 300);
							}
							// v1->v2 end
						}}>
						{({ handleChange, handleSubmit, values, errors }) => (
							<Form>
								<Text style={[SS.fz16, SS.fw600]}>{curWallet.name}</Text>
								<Item
									style={[SS.mt10, SS.ml0, { minHeight: 50 }]}
									stackedLabel
									error={!!errors.password}>
									<Input
										secureTextEntry
										style={[SS.fz14]}
										placeholder={I18n.t('assets.passwordTips')}
										onChangeText={handleChange('password')}
										value={values.password}
									/>
								</Item>
								<View style={[S.marginT(24)]}>
									<Button block onPress={handleSubmit}>
										<Text>{I18n.t('assets.confirm')}</Text>
									</Button>
								</View>
							</Form>
						)}
					</Formik>
				</ScrollView>
			</View>
		</Modal>
		// <Mask opacity={0.3} onMaskClick={() => hide()} visible={isShow}>
		//     <div style={{ width: contentW - 32 }} className='radius10 bgW p16 pa-c password-dialog'>
		//         <Formik
		//             innerRef={formRef}
		//             initialValues={{}}
		//             isValidating={true}
		//             validateOnBlur={false}
		//             validateOnChange={false}
		//             validateOnMount={false}
		//             validationSchema={Yup.object().shape({
		//                 password: Yup.string().required()
		//             })}
		//             onSubmit={async (values) => {
		//                 const { password } = values
		//                 const isPassword = await IotaSDK.checkPassword(curWallet.seed, password)
		//                 if (!isPassword) {
		//                     return Toast.error(I18n.t('assets.passwordError'))
		//                 }
		//                 const obj = {
		//                     ...curWallet,
		//                     password
		//                 }
		//                 editWallet(curWallet.id, obj)
		//                 hide(obj)

		//                 // v1->v2 start
		//                 if (!IotaSDK.checkKeyAndIvIsV2(curWallet.seed)) {
		//                     setTimeout(() => {
		//                         editWallet(curWallet.id, obj, true)
		//                     }, 300)
		//                 }
		//                 // v1->v2 end
		//             }}>
		//             {({ handleChange, handleSubmit, values, errors }) => (
		//                 <Form>
		//                     <div className='fz18 fw600 mb10'>{curWallet.name}</div>
		//                     <Form.Item className={`pl0 ${errors.password && 'form-error'}`}>
		//                         <Input
		//                             type='password'
		//                             className='name-input'
		//                             placeholder={I18n.t('assets.passwordTips')}
		//                             onChange={handleChange('password')}
		//                             value={values.password}
		//                         />
		//                     </Form.Item>
		//                     <div className='mt24'>
		//                         <Button color='primary' block onClick={handleSubmit}>
		//                             {I18n.t('assets.confirm')}
		//                         </Button>
		//                     </div>
		//                 </Form>
		//             )}
		//         </Formik>
		//     </div>
		// </Mask>
	);
};
