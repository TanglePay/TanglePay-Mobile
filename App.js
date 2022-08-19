import React, { useState, useEffect } from 'react';
import { StyleProvider, Root } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { BackHandler, Alert } from 'react-native';
import { panelsList } from '@/panels';
import { Base, Trace, IotaSDK } from '@tangle-pay/common';
import { RootSiblingParent } from 'react-native-root-siblings';
import { StoreContext, useStoreReducer } from '@tangle-pay/store';
import { useChangeNode } from '@tangle-pay/store/common';
import { Theme, Toast } from '@/common';
import _wrap from 'lodash/wrap';
import { DappDialog } from '@/common/components/DappDialog';
import Jailbreak from 'react-native-jailbreak';

// import SplashScreen from 'react-native-splash-screen'
const Stack = createStackNavigator();

export default () => {
	const [store, dispatch] = useStoreReducer();
	const changeNode = useChangeNode();
	const [sceneList, setSceneList] = useState([]);
	// persist cache data into local storage
	const getLocalInfo = async () => {
		// unsensitve data
		const list = ['common.curNodeId', 'common.showAssets', 'common.lang', 'common.price', 'common.disTrace'];
		const res = await Promise.all(list.map((e) => Base.getLocalData(e)));
		list.map((e, i) => {
			switch (e) {
				case 'common.curNodeId':
					changeNode(res[i] || 1);
					break;
				default:
					dispatch({ type: e, data: res[i] });
					break;
			}
		});
		// get encrypted sensitive data
		const sensitiveList = ['common.activityData', 'common.walletsList'];
		const installedKey = 'tangle.installed';
		const installed = await Base.getLocalData(installedKey);
		if (!installed) {
			// clear sensitive data on reinstall
			await Promise.all(sensitiveList.map((e) => Base.removeSensitiveInfo(e)));
		} else {
			const sensitiveRes = await Promise.all(sensitiveList.map((e) => Base.getSensitiveInfo(e)));
			sensitiveList.map((e, i) => {
				dispatch({ type: e, data: sensitiveRes[i] });
			});
		}
		Base.setLocalData(installedKey, 1);

		// changeNode after get walletsList
		const list2 = ['common.curNodeId'];
		const res2 = await Promise.all(list2.map((e) => Base.getLocalData(e)));
		list2.forEach((e, i) => {
			switch (e) {
				case 'common.curNodeId':
					changeNode(res2[i] || 1);
					break;
				default:
					dispatch({ type: e, data: res2[i] });
					break;
			}
		});
	};
	const initChangeNode = async () => {
		// changeNode after get walletsList
		const res = await Base.getLocalData('common.curNodeId');
		changeNode(res || 1);
	};
	const init = async () => {
		Trace.login();
		try {
			await IotaSDK.getNodes();
		} catch (error) {
			console.log(error);
		}
		await getLocalInfo();
		await initChangeNode();
		setSceneList(panelsList);
		// setTimeout(() => {
		//     SplashScreen.hide()
		// }, 300)
	};
	useEffect(() => {
		Jailbreak.check().then((result) => {
			if (result && process.env.NODE_ENV == 'production') {
				Alert.alert(
					'',
					`We have detected that your device has been rooted.
For the sake of security, TanglePay is prohibited from running on such devices.
Please keep your device in non-rooted state and then launch the application again.`,
					[
						{
							text: 'Confirm',
							onPress: () => {
								BackHandler.exitApp();
							}
						}
					]
				);
			}
		});
		Base.globalInit({
			store,
			dispatch,
			Toast
		});
		init();
	}, []);
	if (sceneList.length === 0) {
		return null;
	}
	return (
		<Root>
			<StoreContext.Provider
				value={{
					store,
					dispatch
				}}>
				<StyleProvider style={Theme}>
					<RootSiblingParent>
						<NavigationContainer
							ref={(ref) => {
								Base.setNavigator(ref);
							}}>
							<Stack.Navigator
								initialRouteName={store.common.walletsList.length > 0 ? 'main' : 'account/changeNode'}>
								{sceneList.map((e) => {
									return (
										<Stack.Screen
											options={{
												headerShown: false,
												...TransitionPresets.SlideFromRightIOS
											}}
											key={e.path}
											name={e.path}
											component={e.component}
										/>
									);
								})}
							</Stack.Navigator>
						</NavigationContainer>
						<DappDialog />
					</RootSiblingParent>
				</StyleProvider>
			</StoreContext.Provider>
		</Root>
	);
};
