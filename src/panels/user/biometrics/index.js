import React, { useEffect, useState, useRef } from 'react';
import { Container, Content, View, Text, Switch, Dialog } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { S, SS, Nav, Toast } from '@/common';
import { Base, I18n, IotaSDK } from '@tangle-pay/common';
import { TipsDialog } from './tipsDialog';
import DialogInput from 'react-native-dialog-input';
import { useStore } from '@tangle-pay/store';
import ReactNativeBiometrics from 'react-native-biometrics';
import { useGetNodeWallet } from '@tangle-pay/store/common';

const rnBiometrics = new ReactNativeBiometrics();

export const UserBiometrics = () => {
	const [curWallet] = useGetNodeWallet();
	const [isBio, setIsBio] = useStore('common.biometrics');
	const [showDialog, setShowDialog] = useState(false);
	const [isPwdInput, setIsPwdInput] = useStore('common.pwdInput');
	const [isNotPrompt, setIsNotPrompt] = useStore('common.bioPrompt');
	const [biometrics, setBiometrics] = useState({
		touchId: false,
		faceId: false,
		biometrics: false,
	}); //设备是否支持

	const checkPwd = async (inputPwd) => {
		const isPassword = await IotaSDK.checkPassword(curWallet.seed, inputPwd);
		if (!isPassword) {
			console.log(curWallet.password);
			setShowDialog(false);
			setIsBio(false);
			return Toast.error(I18n.t('assets.passwordError'));
		} else {
			setIsPwdInput(true);
			setShowDialog(false);
			return Toast.success(I18n.t('user.biometricsSucc'));
		}
	};

	const bioSwitchChange = () => {
		if (isBio) {
			setIsBio(false);
		} else {
			rnBiometrics
				.simplePrompt({
					promptMessage: I18n.t('user.bioVerification'),
					cancelButtonText: I18n.t('apps.cancel')
				})
				.then((resultObject) => {
					const { success } = resultObject;
					if (success) {
						console.log('successful biometrics provided');
						setIsBio(true);
						if (!isPwdInput) {
							setShowDialog(true);
						}
					} else {
						console.log('user cancelled biometric prompt');
					}
				})
				.catch(() => {
					console.log('biometrics failed');
					setIsBio(false);
				});
		}
	};

	const notPromptSwitchChange = () => {
		if (isNotPrompt) {
			setIsPwdInput(false);
		}
		setIsNotPrompt(!isNotPrompt);
	};

	useEffect(() => {
		rnBiometrics.isSensorAvailable().then((resultObject) => {
			const { available, biometryType } = resultObject;
			const availableBiometrics = {
				touchId: false,
				faceId: false,
				biometrics: false,
			};
			if (available && biometryType === ReactNativeBiometrics.TouchID) {
				availableBiometrics.touchId = true;
				console.log('TouchID is supported');
			}
			if (available && biometryType === ReactNativeBiometrics.FaceID) {
				availableBiometrics.faceId = true;
				console.log('FaceID is supported');
			}
			if (available && biometryType === ReactNativeBiometrics.Biometrics) {
				availableBiometrics.biometrics = true;
				console.log('Biometrics is supported');
			}
			setBiometrics(availableBiometrics);
		});
	}, []);

	return (
		<Container>
			<Nav title={'Biometrics'} />
			<Content>
				<TouchableOpacity
					onPress={bioSwitchChange}
					activeOpacity={0.8}
					style={[SS.row, SS.ac, SS.jsb, SS.ph30, SS.pv20, S.border(2)]}>
					<View style={[SS.row, SS.ac]}>
						<Text>{I18n.t('user.enableBiometrics')}</Text>
					</View>
					<Switch value={isBio} onValueChange={bioSwitchChange} />
				</TouchableOpacity>
				<TouchableOpacity
					onPress={notPromptSwitchChange}
					activeOpacity={0.8}
					style={[SS.row, SS.ac, SS.jsb, SS.ph30, SS.pv20, S.border(2)]}>
					<View style={[SS.row, SS.ac]}>
						<Text>{I18n.t('user.noPrompt')}</Text>
					</View>
					<Switch value={isNotPrompt} onValueChange={notPromptSwitchChange} />
				</TouchableOpacity>
			</Content>
			<DialogInput
				isDialogVisible={showDialog}
				title={I18n.t('assets.password')}
				hintInput={'Your Password'}
				textInputProps={{ secureTextEntry: true }}
				submitInput={(inputText) => {
					checkPwd(inputText);
				}}
				closeDialog={() => {
					setShowDialog(false);
					setIsBio(false);
				}}
				cancelText={I18n.t('apps.cancel')}
				submitText={I18n.t('assets.confirm')}
			/>
		</Container>
	);
};
