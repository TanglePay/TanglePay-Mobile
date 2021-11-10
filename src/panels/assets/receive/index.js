import React, { useEffect } from 'react';
import { Container, View, Text, Button } from 'native-base';
import { Image, StatusBar, ImageBackground } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { Base, Nav1, S, SS, I18n, images, ThemeVar, Toast } from '@/common';
import QRCode from 'react-native-qrcode-svg';
import { useGetNodeWallet } from '@/store/common';
import Share from 'react-native-share';
export const AssetsReceive = () => {
	const [curWallet] = useGetNodeWallet();
	useEffect(() => {
		StatusBar.setBackgroundColor('#1F7EFC', true);
		return () => {
			StatusBar.setBackgroundColor(ThemeVar.statusBarColor, true);
		};
	}, []);
	return (
		<Container style={[S.bg('#1F7EFC')]}>
			<Nav1 title={I18n.t('assets.receiver')} leftIcon={images.com.left_w} titleStyle={{ ...S.cW }} />
			<View style={[SS.mh20, SS.mt10, SS.radius10, SS.bgW, SS.ac]}>
				<View style={[SS.pv20]}>
					<Text style={[SS.fz16, SS.cS]}>{I18n.t('assets.scanQRcode')}</Text>
				</View>
				<View style={[S.border(2, '#ddd', 1), SS.w100, SS.ac, SS.pb20]}>
					<ImageBackground source={images.com.scan_bg} style={[S.wh(220), SS.c]}>
						{curWallet.address && <QRCode value={curWallet.address} size={200} />}
					</ImageBackground>
				</View>
				<View style={[SS.pt20, SS.ph50]}>
					<View style={[SS.ph10, SS.pv5, SS.bgS, S.radius(4)]}>
						<Text style={[SS.fz11, SS.tc]}>{curWallet.address}</Text>
					</View>
				</View>
				<View style={[SS.pb10, SS.ph50, SS.w100]}>
					<View style={[SS.row, SS.jsb]}>
						<Button
							transparent
							onPress={() => {
								Clipboard.setString(curWallet.address);
								Toast.success(I18n.t('assets.copied'));
							}}>
							<Image style={[[S.wh(12.8, 14.3)]]} source={images.com.copy} />
							<Text style={[SS.fz16, SS.pl10, S.color(ThemeVar.textColor)]}>{I18n.t('assets.copy')}</Text>
						</Button>
						<Button
							transparent
							onPress={() => {
								Share.open({
									message: curWallet.address,
									showAppsToView: true,
									saveToFiles: false
								})
									.then((res) => {
										console.log(res);
									})
									.catch((err) => {
										err && console.log(err);
									});
							}}>
							<Image style={[[S.wh(13, 13)]]} source={images.com.share} />
							<Text style={[SS.fz16, SS.pl10, S.color(ThemeVar.textColor)]}>
								{I18n.t('assets.share')}
							</Text>
						</Button>
					</View>
				</View>
			</View>
		</Container>
	);
};
