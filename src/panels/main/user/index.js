import React from 'react';
import { Container, View, Text } from 'native-base';
import { Image, TouchableOpacity } from 'react-native';
import { Base, Nav, I18n, S, SS, images } from '@tangle-pay/common';
import { useStore } from '@tangle-pay/store';

export const User = () => {
	useStore('common.lang');
	const list = [
		{
			icon: images.com.wallet,
			label: I18n.t('user.manageWallets'),
			path: 'user/wallets'
		},
		{
			icon: images.com.set,
			label: I18n.t('user.setting'),
			path: 'user/setting'
		},
		// {
		// 	icon: images.com.network,
		// 	label: I18n.t('user.network'),
		// 	path: 'user/network'
		// },
		{
			icon: images.com.about,
			label: I18n.t('user.aboutUs'),
			path: 'user/aboutUs'
		}
	];
	return (
		<Container>
			<Nav title={I18n.t('user.me')} leftIcon={false} />
			<View>
				{list.map((e) => {
					return (
						<TouchableOpacity
							activeOpacity={0.8}
							onPress={() => {
								Base.push(e.path);
							}}
							key={e.path}
							style={[SS.row, SS.ac, SS.jsb, SS.ph30, SS.pv20, S.border(2)]}>
							<View style={[SS.row, SS.ac]}>
								<Image resizeMode='contain' style={[S.wh(20)]} source={e.icon} />
								<Text style={[SS.fz17, SS.ml10]}>{e.label}</Text>
							</View>
							<View>
								<Image style={[S.wh(16)]} source={images.com.right} />
							</View>
						</TouchableOpacity>
					);
				})}
			</View>
		</Container>
	);
};
