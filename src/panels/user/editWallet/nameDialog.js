import React, { useState, useImperativeHandle } from 'react';
import { View, Text, Form, Item, Input, Button } from 'native-base';
import { ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import { I18n } from '@tangle-pay/common';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useEditWallet } from '@tangle-pay/store/common';
import { S, SS } from '@/common';

export const NameDialog = ({ dialogRef, data }) => {
	const editWallet = useEditWallet();
	const [isShow, setShow] = useState(false);
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
	return (
		<Modal hasBackdrop backdropOpacity={0.3} onBackButtonPress={hide} onBackdropPress={hide} isVisible={isShow}>
			<View style={[SS.w100, SS.radius10, SS.bgW]}>
				<ScrollView contentContainerStyle={[SS.p16]}>
					<Formik
						initialValues={{
							name: data.name
						}}
						isValidating={true}
						validationSchema={Yup.object().shape({
							name: Yup.string().required()
						})}
						onSubmit={(values) => {
							editWallet(data.id, { name: values.name });
							hide();
						}}>
						{({ handleChange, handleSubmit, values, errors }) => (
							<Form>
								<Text style={[SS.fz16, SS.fw600]}>{I18n.t('account.intoName')}</Text>
								<Item style={[SS.mt10, SS.ml0, { minHeight: 50 }]} stackedLabel error={!!errors.name}>
									<Input
										style={[SS.fz14]}
										placeholder={I18n.t('account.intoNameTips')}
										onChangeText={handleChange('name')}
										value={values.name}
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
	);
};
