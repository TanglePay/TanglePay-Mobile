import React, { useEffect, useState } from 'react';
import { Container, Content, View, Text } from 'native-base';
import { Image, Linking, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { I18n, API_URL } from '@tangle-pay/common';
import DeviceInfo from 'react-native-device-info';
import Clipboard from '@react-native-clipboard/clipboard';
import Config from 'react-native-config';
import { Nav, S, SS, SvgIcon, Toast } from '@/common';
import logo from '@tangle-pay/assets/images/logo.png';
export const UserAboutUs = () => {
	var version = DeviceInfo.getVersion();
	const initList = [
		{
			key: 'version',
			label: I18n.t('user.versionUpdate'),
			bottom: 10
		},
		{
			label: I18n.t('user.website'),
			url: 'https://tanglepay.com'
		},
		{
			label: I18n.t('user.telegramGroup'),
			url: 'https://t.me/tanglepay'
		},
		{
			label: I18n.t('user.discord'),
			url: 'https://discord.gg/XmNd64fEc2'
		},
		{
			label: I18n.t('user.groupEmail'),
			url: 'mailto:support@tanglepay.com'
		}
	];
	const [list, setList] = useState(initList);
	useEffect(() => {
		fetch(`${API_URL}/update.json?v=${new Date().getTime()}`)
			.then((res) => res.json())
			.then((res) => {
				setList((e) => {
					const newVersion = res[Platform.OS];
					const url = res[`${Platform.OS}Url`];
					e[0].value = `${I18n.t('user.versionNew')} ${newVersion}`;
					if (newVersion !== version) {
						e[0].url = url;
						e[0].dot = true;
					}
					return [...e];
				});
			})
			.catch((err) => console.log(err));
	}, []);
	return (
		<Container>
			<Nav title={I18n.t('user.aboutUs')} />
			<Content>
				<View style={[SS.c, SS.pv30]}>
					<Image style={[S.wh(65)]} source={logo} />
					<Text style={[SS.fz16, SS.mt10]}>TanglePay</Text>
					<Text style={[SS.fz14, SS.cS, SS.mt10]}>
						{I18n.t('user.curVersion')}
						{version}
					</Text>
				</View>
				{list.map((e, i) => {
					return (
						<TouchableOpacity
							key={i}
							activeOpacity={0.8}
							onPress={() => {
								if (e.onPress) {
									e.onPress();
								} else if (e.url) {
									Linking.openURL(e.url)
										.then((res) => {
											console.log(res);
										})
										.catch((err) => {
											Clipboard.setString(e.address);
											Toast.success(I18n.t('assets.copied'));
										});
								} else if (e.key === 'version') {
									Toast.show(I18n.t('user.latestVersion'));
								}
							}}
							style={[
								SS.row,
								SS.ac,
								SS.jsb,
								SS.ph20,
								SS.pv20,
								i === 0 && S.border(0),
								S.border(2, e.bottom ? '#f5f5f5' : '#ddd', e.bottom || StyleSheet.hairlineWidth)
							]}>
							<View style={[SS.row, SS.ac]}>
								<Text style={[SS.fz17, SS.ml10]}>{e.label}</Text>
							</View>
							<View style={[SS.row, SS.ac]}>
								{e.value && <Text style={[SS.fz17, SS.cS, SS.mr10]}>{e.value}</Text>}
								{e.dot && <View style={[S.wh(6), SS.mr5, S.bg('red'), S.radius(6)]}></View>}
								<SvgIcon size={14} name='right' />
							</View>
						</TouchableOpacity>
					);
				})}
			</Content>
		</Container>
	);
};
