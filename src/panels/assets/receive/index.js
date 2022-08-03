import React, { useEffect } from 'react';
import { Container, View, Text, Button } from 'native-base';
import { StatusBar, ImageBackground } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { I18n } from '@tangle-pay/common';
import QRCode from 'react-native-qrcode-svg';
import { useGetNodeWallet } from '@tangle-pay/store/common';
import Share from 'react-native-share';
import { Nav, S, SS, ThemeVar, SvgIcon, Toast } from '@/common';
import scan_bg from '@tangle-pay/assets/images/scan_bg.png';
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
			<Nav
				headerStyle={{ borderBottomWidth: 0 }}
				title={I18n.t('assets.receiver')}
				leftStyle={{ ...S.cW }}
				titleStyle={{ ...S.cW }}
			/>
			<View style={[SS.mh20, SS.mt10, SS.radius10, SS.bgW, SS.ac]}>
				<View style={[SS.pv20]}>
					<Text style={[SS.fz16, SS.cS]}>{I18n.t('assets.scanQRcode')}</Text>
				</View>
				<View style={[S.border(2, '#ddd', 1), SS.w100, SS.ac, SS.pb20]}>
					<ImageBackground source={scan_bg} style={[S.wh(220), SS.c]}>
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
							<SvgIcon name='copy' size={20} />
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
							<SvgIcon name='share' size={20} />
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
