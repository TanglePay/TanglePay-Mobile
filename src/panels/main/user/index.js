import React from 'react';
import { Container, View, Text } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { Base, I18n, IotaSDK } from '@tangle-pay/common';
import { useStore } from '@tangle-pay/store';
import { Nav, S, SS, SvgIcon, ThemeVar } from '@/common';
import { useGetNodeWallet } from '@tangle-pay/store/common';
import { useGetParticipationEvents, useGetRewards } from '@tangle-pay/store/staking';

export const User = () => {
	const [curWallet] = useGetNodeWallet();
	useGetParticipationEvents();
	useGetRewards(curWallet, false);
	const curNode = IotaSDK.nodes.find((d) => d.id == curWallet.nodeId);
	const filterMenuList = curNode?.filterMenuList || [];
	const hasStake = !filterMenuList.includes('staking');
	useStore('common.lang');
	const list = [
		{
			icon: 'wallet',
			label: I18n.t('user.manageWallets'),
			// path: 'user/wallets'
			path: 'user/editWallet'
		},
		hasStake && {
			icon: 'stake',
			label: I18n.t('staking.title'),
			path: 'stake/index'
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
	].filter((e) => !!e);
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
							style={[SS.row, SS.ac, SS.jsb, SS.ph16, { height: 60 }, S.border(2)]}>
							<View style={[SS.row, SS.ac]}>
								<SvgIcon size={24} name={e.icon} color={ThemeVar.brandPrimary} />
								<Text style={[SS.fz16, SS.ml16]}>{e.label}</Text>
							</View>
							<SvgIcon size={16} name='right' />
						</TouchableOpacity>
					);
				})}
			</View>
		</Container>
	);
};
