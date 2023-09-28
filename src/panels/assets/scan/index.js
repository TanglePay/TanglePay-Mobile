import React, { useEffect, useState, useRef } from 'react';
import { Container, View, Text } from 'native-base';
import { StyleSheet, PermissionsAndroid, Animated, Easing, ImageBackground } from 'react-native';
import { Base, I18n } from '@tangle-pay/common';
import { RNCamera } from 'react-native-camera';
import { useRoute } from '@react-navigation/native';
import _throttle from 'lodash/throttle';
import { launchImageLibrary } from 'react-native-image-picker';
import { readerQR } from 'react-native-lewin-qrcode';
import _get from 'lodash/get';
import { Nav, S, SS, ThemeVar, Toast } from '@/common';
import scan_bg from '@tangle-pay/assets/images/scan_bg.png';
import { Linking } from 'react-native';

let getDataFlag = false;
export const AssetsScan = () => {
	const [moveAnim] = useState(new Animated.Value(-2));
	const { params } = useRoute();
	const isClickRef = useRef();
	const timeHandleRef = useRef();
	useEffect( () => {
		const asyncFunc =async ()=>{
			await requestCameraPermission();
			startAnimation();
			getDataFlag = false;
			return () => {
				getDataFlag = false;
				if (timeHandleRef.current) {
					clearTimeout(timeHandleRef.current);
				}
			};
		}
		asyncFunc();
	}, []);
	const requestCameraPermission = async () => {
		if (ThemeVar.platform === 'android') {
			try {
				const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
					title: I18n.t('assets.scanPermissionsTitle'),
					message: I18n.t('assets.scanPermissionsTips')
				});
				if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
					Base.goBack();
				}
			} catch (err) {
				Base.goBack();
			}
		}
	};
	const startAnimation = () => {
		moveAnim.setValue(-2);
		Animated.sequence([
			Animated.timing(moveAnim, {
				toValue: 200,
				duration: 1500,
				easing: Easing.linear,
				useNativeDriver: true
			}),
			Animated.timing(moveAnim, {
				toValue: -1,
				duration: 1500,
				easing: Easing.linear,
				useNativeDriver: true
			})
		]).start(() => startAnimation());
	};
	const onBarCodeRead = (result) => {
		const { data } = result;
		if (getDataFlag) {
			return;
		}
		getDataFlag = true;
		if (/^tanglepay:\/\//.test(data)) {
			Linking.openURL(data);
			Base.goBack();
			return;
		}
		if (params?.setReceiver) {
			params.setReceiver(data);
			Base.goBack();
		} else {
			Base.replace('assets/send', { address: data });
		}
	};
	const onImageLibrary = () => {
		if (isClickRef.current) {
			return;
		}
		launchImageLibrary(
			{
				mediaType: 'photo'
			},
			(res) => {
				const uri = _get(res, 'assets.0.uri');
				if (!uri) return;
				readerQR(uri)
					.then((data) => {
						onBarCodeRead({ data });
					})
					.catch(() => {
						Toast.error(I18n.t('assets.readFail'));
					});
			}
		);
		isClickRef.current = true;
		timeHandleRef.current = setTimeout(() => {
			isClickRef.current = false;
		}, 1000);
	};
	return (
		<Container>
			<Nav
				bodyStyle={{ flex: 2 }}
				title={I18n.t('assets.scanTitle')}
				rightLabel={I18n.t('assets.album')}
				onRight={onImageLibrary}
			/>
			<RNCamera
				captureAudio={false}
				autoFocus={RNCamera.Constants.AutoFocus.on} /*autofocus*/
				style={[SS.flex1, SS.c]}
				type={RNCamera.Constants.Type.back} /*switch front and rear camera*/
				flashMode={RNCamera.Constants.FlashMode.off} /*flash mode*/
				notAuthorizedView={
					<View style={[SS.c, S.h(600)]}>
						<Text style={[SS.fz17]}>{I18n.t('assets.scanError')}</Text>
					</View>
				}
				onBarCodeRead={_throttle(onBarCodeRead, 800)}>
				<View
					style={{
						width: 500,
						height: 220,
						backgroundColor: 'rgba(0,0,0,0.5)'
					}}
				/>
				<View style={[SS.row]}>
					<View style={{ backgroundColor: 'rgba(0,0,0,0.5)', ...S.wh(200) }} />
					<ImageBackground source={scan_bg} style={[S.wh(200)]}>
						<Animated.View style={[styles.border, { transform: [{ translateY: moveAnim }] }]} />
					</ImageBackground>
					<View style={{ backgroundColor: 'rgba(0,0,0,0.5)', ...S.wh(200) }} />
				</View>

				<View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', width: 500, alignItems: 'center' }}>
					<Text style={[SS.mt20, SS.cW]}>{I18n.t('assets.scanTips')}</Text>
				</View>
			</RNCamera>
		</Container>
	);
};

const styles = StyleSheet.create({
	border: {
		flex: 0,
		width: 200,
		height: 2,
		backgroundColor: ThemeVar.brandPrimary,
		borderRadius: 50
	}
});
