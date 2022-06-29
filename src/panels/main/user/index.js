import React from 'react';
import { Container, View, Text } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { Base, I18n } from '@tangle-pay/common';
import { useStore } from '@tangle-pay/store';
import { Nav, S, SS, SvgIcon, ThemeVar } from '@/common';
import { useGetNodeWallet } from '@tangle-pay/store/common';

export const User = () => {
	const [curWallet] = useGetNodeWallet();
	useStore('common.lang');
	const list = [
		{
			icon: 'wallet',
			label: I18n.t('user.manageWallets'),
			// path: 'user/wallets'
			path: 'user/editWallet'
		},
		{
			icon: 'set',
			label: I18n.t('user.setting'),
			path: 'user/setting'
		},
		{
			icon: 'about',
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
								if (e.path === 'user/editWallet' && !curWallet.address) {
									Base.push('assets/wallets');
								} else {
									Base.push(e.path);
								}
							}}
							key={e.path}
							style={[SS.row, SS.ac, SS.jsb, SS.ph30, SS.pv20, S.border(2)]}>
							<View style={[SS.row, SS.ac]}>
								<SvgIcon size={24} name={e.icon} />
								<Text style={[SS.fz17, SS.ml10]}>{e.label}</Text>
							</View>
							<SvgIcon size={14} name='right' />
						</TouchableOpacity>
					);
				})}
			</View>
		</Container>
	);
};
