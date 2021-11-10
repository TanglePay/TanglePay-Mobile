import React, { useEffect } from 'react';
import { Image, StyleSheet } from 'react-native';
import { Text } from 'native-base';
import { ThemeVar, images, S, I18n, IotaSDK } from '@/common';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Assets } from './assets';
import { User } from './user';
import { useStore } from '@/store';
import { useGetNodeWallet } from '@/store/common';

const Tab = createBottomTabNavigator();
export const Main = () => {
	const [curWallet] = useGetNodeWallet();
	const [_, refreshAssets] = useStore('common.forceRequest');
	const routes = [
		{
			key: 'assets',
			title: I18n.t('assets.assets'),
			component: Assets,
			activeIcon: images.com.assets_1,
			icon: images.com.assets_0
		},
		{
			key: 'user',
			title: I18n.t('user.me'),
			component: User,
			activeIcon: images.com.me_1,
			icon: images.com.me_0
		}
	];
	useEffect(() => {
		IotaSDK.setMqtt(curWallet.address, refreshAssets);
	}, [curWallet.address]);
	return (
		<Tab.Navigator
			initialRouteName='assets'
			inactiveColor={ThemeVar.textColor}
			activeColor={ThemeVar.textColor}
			barStyle={{ backgroundColor: ThemeVar.cardDefaultBg }}
			shifting={false}>
			{routes.map((e) => {
				return (
					<Tab.Screen
						key={e.key}
						name={e.key}
						component={e.component}
						options={{
							headerShown: false,
							tabBarLabel: ({ focused }) => (
								<Text style={[focused ? styles.activeLabel : styles.label]}>{e.title}</Text>
							),
							tabBarIcon: ({ focused }) => (
								<Image resizeMode='contain' style={S.wh(25)} source={focused ? e.activeIcon : e.icon} />
							)
						}}></Tab.Screen>
				);
			})}
		</Tab.Navigator>
	);
};

const styles = StyleSheet.create({
	label: {
		...S.font(10, ThemeVar.textColor)
	},
	activeLabel: {
		...S.font(10, ThemeVar.brandPrimary)
	}
});
