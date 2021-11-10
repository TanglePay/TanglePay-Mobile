import React, { useState, useEffect } from 'react';
import { StyleProvider, Root } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { panelsList } from '@/panels';
import { Base, Theme, Trace } from '@/common';
import { RootSiblingParent } from 'react-native-root-siblings';
import { StoreContext, useStoreReducer } from '@/store';
import { useChangeNode } from '@/store/common';
import _wrap from 'lodash/wrap';
// import SplashScreen from 'react-native-splash-screen'
const Stack = createStackNavigator();

export default () => {
	const [store, dispatch] = useStoreReducer();
	const changeNode = useChangeNode(dispatch);
	const [sceneList, setSceneList] = useState([]);
	// persist cache data into local storage
	const getLocalInfo = async () => {
		// unsensitve data
		const list = ['common.curNodeId', 'common.showAssets', 'common.lang', 'common.price'];
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
	};
	const init = async () => {
		Trace.login();
		await getLocalInfo();
		setSceneList(panelsList);
		// setTimeout(() => {
		//     SplashScreen.hide()
		// }, 300)
	};
	useEffect(() => {
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
						<NavigationContainer ref={(ref) => (Base.navigator = ref)}>
							<Stack.Navigator
								initialRouteName={store.common.walletsList.length > 0 ? 'main' : 'account/login'}>
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
					</RootSiblingParent>
				</StyleProvider>
			</StoreContext.Provider>
		</Root>
	);
};
