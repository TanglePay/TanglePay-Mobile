import React, { useState, useImperativeHandle, useRef, useEffect } from 'react';
import { View, Text, Form, Item, Input, Button, Step } from 'native-base';
import { ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import { I18n, IotaSDK } from '@tangle-pay/common';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useEditWallet } from '@tangle-pay/store/common';
import { useSelectWallet } from '@tangle-pay/store/common';
import { S, SS } from '@/common';
import { StepInput } from '@/common/components/StepInput';
import BigNumber from 'bignumber.js';

export const GasDialog = ({ dialogRef }) => {
	const [isShow, setShow] = useState(false);
	const callBackRef = useRef();
	const formRef = useRef();
	const [gasInfo, setGasInfo] = useState({});
	useImperativeHandle(
		dialogRef,
		() => {
			return {
				show
			};
		},
		[]
	);
	const show = (gasInfo, callBack) => {
		const { gasLimit, gasPrice } = gasInfo;
		if (formRef.current) {
			if (gasLimit) {
				setGasInfo({ ...gasInfo });
				formRef.current.setFieldValue('gasLimit', gasLimit);
				formRef.current.setFieldValue('gasPrice', gasPrice);
			}
		}
		if (gasLimit) {
			setGasInfo({ ...gasInfo });
		} else {
			setGasInfo({});
		}
		callBackRef.current = callBack;
		setShow(true);
	};
	const hide = (info) => {
		setShow(false);
		if (info) {
			callBackRef.current && callBackRef.current({ ...info });
		}
	};
	useEffect(() => {
		try {
			let { gasPrice, gasLimit } = gasInfo;
			gasPrice = IotaSDK.getNumberStr(parseFloat(gasPrice) || '');
			gasLimit = IotaSDK.getNumberStr(parseFloat(gasLimit) || '');
			let total = 0;
			let totalEth = 0;
			if (gasPrice && gasLimit) {
				total = IotaSDK.getNumberStr(gasPrice * gasLimit);
				totalEth = IotaSDK.getNumberStr(total / 1000000000);
			}
			setGasInfo({
				...gasInfo,
				total,
				totalEth
			});
		} catch (error) {
			console.log(error);
		}
	}, [JSON.stringify(gasInfo)]);
	return (
		<Modal
			hasBackdrop
			backdropOpacity={0.3}
			onBackButtonPress={() => hide()}
			onBackdropPress={() => hide()}
			isVisible={isShow}>
			<View style={[SS.w100, SS.radius10, SS.bgW]}>
				<ScrollView contentContainerStyle={[SS.p16]}>
					<View style={[S.border(2), SS.pv12]}>
						<Text style={[SS.fz, SS.fw600]} className='border-b pv12 ph16 fz16 fw600'>
							{I18n.t('assets.editPriority')}
						</Text>
					</View>
					<Formik
						innerRef={formRef}
						initialValues={{ ...gasInfo }}
						isValidating={true}
						validateOnBlur={false}
						validateOnChange={false}
						validateOnMount={false}
						validationSchema={Yup.object().shape({
							gasPrice: Yup.string().required(),
							gasLimit: Yup.string().required()
						})}
						onSubmit={async (values) => {
							hide(gasInfo);
						}}>
						{({ setFieldValue, handleSubmit, values, errors }) => (
							<Form>
								<Text style={[SS.fz16, SS.fw400, SS.mt16]}>{I18n.t('assets.gasFee')} (GWEI)</Text>
								<Item style={[SS.ml0]} error={!!errors.gasPrice}>
									<StepInput
										onChangeText={(e) => {
											e = IotaSDK.getNumberStr(e);
											setGasInfo({ ...gasInfo, gasPrice: e });
											setFieldValue('gasPrice', e);
										}}
										value={values.gasPrice || ''}
									/>
								</Item>
								<Text style={[SS.fz16, SS.fw400, SS.mt16]}>{I18n.t('assets.gasLimit')}</Text>
								<Item style={[SS.ml0]} error={!!errors.gasLimit}>
									<StepInput
										onChangeText={(e) => {
											e = IotaSDK.getNumberStr(e);
											setGasInfo({ ...gasInfo, gasLimit: e });
											setFieldValue('gasLimit', e);
										}}
										value={values.gasLimit || ''}
									/>
								</Item>
								<Text style={[SS.fz16, SS.fw400, SS.mt16]}>{I18n.t('assets.maxFee')} (GWEI)</Text>
								<Item style={[SS.ml0, { borderBottomWidth: 0 }]} underline={false}>
									<Text style={[SS.fz16, SS.pt12, SS.pb8]}>{gasInfo.total || ''}</Text>
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
