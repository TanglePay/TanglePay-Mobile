import React, { useState, useEffect, useRef } from 'react';
import { StyleProvider, Root } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { Alert } from 'react-native';
import { panelsList } from '@/panels';
import { Base, Trace, IotaSDK } from '@tangle-pay/common';
import { RootSiblingParent } from 'react-native-root-siblings';
import { StoreContext, useStoreReducer } from '@tangle-pay/store';
import { useChangeNode } from '@tangle-pay/store/common';
import { Theme, Toast, StorageFacade } from '@/common';
import _wrap from 'lodash/wrap';
import { DappDialog } from '@/common/components/DappDialog';
import Jailbreak from 'react-native-jailbreak';
import Exit from 'react-native-exit-app';
import { PasswordDialog } from '@/common/components/passwordDialog';
import SplashScreen from 'react-native-splash-screen';
import {
	context,
	ensureInited,
	getIsUnlocked,
	init as pinInit,
	markWalletPasswordEnabled,
	isNewWalletFlow,
	setStorageFacade
} from '@tangle-pay/domain';

const Stack = createStackNavigator();
const getFirstScreen = async (store) => {
	await ensureInited();
	const isNewUser = await isNewWalletFlow();
	if (!isNewUser) {
		await ensureExistingUserWalletStatus();
	}
	if (context.state.isPinSet && !getIsUnlocked()) {
		Base.push('unlock');
		return 'unlock';
	} else {
		Base.globalDispatch({
			type: 'common.canShowDappDialog',
			data: true
		});
		return context.state.walletCount > 0 ? 'main' : 'account/changeNode';
	}
};
const ensureExistingUserWalletStatus = async () => {
	const isFixed = await Base.getLocalData('pin.isExistingFixed');
	if (isFixed) return;
	const list = await IotaSDK.getWalletList();
	const tasks = [];
	for (const wallet of list) {
		const { id, type } = wallet;
		if (type === 'ledger') {
			continue;
		}
		tasks.push(markWalletPasswordEnabled(id));
	}
	if (tasks.length > 0) {
		await Promise.all(tasks);
	}
	Base.setLocalData('pin.isExistingFixed', '1');
};
export default () => {
	const [store, dispatch] = useStoreReducer();
	const changeNode = useChangeNode();
	const passwordDialog = useRef();
	const [sceneList, setSceneList] = useState([]);
	const [firstScreen, setFirstScreen] = useState();
	// persist cache data into local storage
	const getLocalInfo = async () => {
		// unsensitve data
		const list = ['common.showAssets', 'common.lang', 'common.price', 'common.disTrace', 'common.bioPrompt'];
		const res = await Promise.all(list.map((e) => Base.getLocalData(e)));
		list.map((e, i) => {
			switch (e) {
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
		Toast.showLoading();
		IotaSDK.getNodes(async () => {
			try {
				await getLocalInfo();
				await initChangeNode();
				Toast.hideLoading();
				setSceneList(panelsList);
				const nodeList = await IotaSDK.getWalletList();
				if (nodeList.length == 0) {
					await pinInit(0);
				}
				const firstScreen = await getFirstScreen(store);
				console.log('firstScreen', firstScreen);
				setFirstScreen(firstScreen);
				setTimeout(() => {
					SplashScreen.hide();
				}, 300);
			} catch (e) {
				console.log(e);
			}
		});
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
								Exit.exitApp();
							}
						}
					]
				);
			}
		});
		setStorageFacade(StorageFacade);
		Base.globalInit({
			store,
			dispatch,
			Toast
		});
		IotaSDK.passwordDialog = passwordDialog;
		init();
	}, []);
	if (sceneList.length === 0 || !firstScreen) {
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
							{firstScreen && (
								<Stack.Navigator initialRouteName={firstScreen}>
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
							)}
						</NavigationContainer>
						<DappDialog />
						<PasswordDialog dialogRef={passwordDialog} />
					</RootSiblingParent>
				</StyleProvider>
			</StoreContext.Provider>
		</Root>
	);
};
