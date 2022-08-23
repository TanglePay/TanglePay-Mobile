import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from 'native-base';
import { I18n, IotaSDK } from '@tangle-pay/common';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Assets } from './assets';
import { User } from './user';
import { Discover } from './discover';
import { Apps } from './apps';
import { useGetNodeWallet, useEditWallet } from '@tangle-pay/store/common';
import { SvgIcon, ThemeVar, S, SS, Theme } from '@/common';
import { useStore } from '@tangle-pay/store';
import Shadow from '@/common/components/Shadow';

const bottom = ThemeVar.isIphoneX ? 10 : 0;
const MyTabBar = ({ state, descriptors, navigation }) => {
	return (
		<Shadow>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					height: 64 + bottom,
					backgroundColor: '#fff',
					paddingBottom: bottom + 10
				}}>
				{state.routes.map((route, index) => {
					const { options } = descriptors[route.key];
					const Label = options.tabBarLabel;
					const Icon = options.tabBarIcon;
					const isFocused = state.index === index;
					const onPress = () => {
						const event = navigation.emit({
							type: 'tabPress',
							target: route.key,
							canPreventDefault: true
						});
						if (!isFocused && !event.defaultPrevented) {
							navigation.navigate({ name: route.name, merge: true });
						}
					};
					const onLongPress = () => {
						navigation.emit({
							type: 'tabLongPress',
							target: route.key
						});
					};
					return (
						<TouchableOpacity
							activeOpacity={0.8}
							key={route.key}
							onPress={onPress}
							onLongPress={onLongPress}
							style={[SS.flex1, SS.ac]}>
							<Icon focused={isFocused} />
							<Label focused={isFocused} />
						</TouchableOpacity>
					);
				})}
			</View>
		</Shadow>
	);
};

const Tab = createBottomTabNavigator();
export const Main = () => {
	const initRoutes = [
		{
			key: 'assets',
			title: I18n.t('assets.assets'),
			component: Assets
		},
		{
			key: 'apps',
			title: I18n.t('apps.title'),
			component: Apps
		},
		{
			key: 'staking',
			title: I18n.t('discover.title'),
			component: Discover
		},
		{
			key: 'me',
			title: I18n.t('user.me'),
			component: User
		}
	];
	const editWallet = useEditWallet();
	const [lang] = useStore('common.lang');
	const [curWallet] = useGetNodeWallet();
	const [routes, setRoutes] = useState([...initRoutes]);
	useEffect(() => {
		IotaSDK.changeNodesLang(lang);
	}, [lang]);
	useEffect(() => {
		IotaSDK.setMqtt(curWallet.address);
	}, [curWallet.address + curWallet.nodeId]);
	useEffect(() => {
		const filterMenuList = IotaSDK.nodes.find((e) => e.id === curWallet.nodeId)?.filterMenuList || [];
		setRoutes([...initRoutes.filter((e) => !filterMenuList.includes(e.key))]);
	}, [curWallet.nodeId, JSON.stringify(initRoutes)]);
	useEffect(() => {
		if (curWallet.seed && !IotaSDK.checkKeyAndIvIsV2(curWallet.seed)) {
			editWallet(curWallet.id, { ...curWallet }, true);
		}
	}, [curWallet.seed]);
	return (
		<Tab.Navigator
			initialRouteName='assets'
			inactiveColor={ThemeVar.textColor}
			activeColor={ThemeVar.textColor}
			barStyle={{ backgroundColor: ThemeVar.cardDefaultBg }}
			tabBar={(props) => <MyTabBar {...props} />}
			shifting={false}>
			{routes.map((e) => {
				return (
					<Tab.Screen
						key={e.key}
						name={e.key}
						title={e.title}
						component={e.component}
						options={{
							headerShown: false,
							tabBarLabel: ({ focused }) => (
								<Text style={[SS.fz10, focused ? styles.activeLabel : styles.label]}>{e.title}</Text>
							),
							tabBarIcon: ({ focused }) => (
								<SvgIcon
									name={e.key}
									size={34}
									color={focused ? ThemeVar.brandPrimary : ThemeVar.textColor}
								/>
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
