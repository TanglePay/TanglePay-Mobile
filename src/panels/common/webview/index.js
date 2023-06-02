import React, { useEffect, useState, useRef } from 'react';
import { Container, Content, Right, Button } from 'native-base';
import { useRoute } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { Nav, ThemeVar } from '@/common';
import { Base, IotaSDK } from '@tangle-pay/common';
import { Bridge } from '@/common/bridge';
import { SvgIcon } from '@/common/assets';
import { useGetNodeWallet } from '@tangle-pay/store/common';
import { StatusBar, Dimensions } from 'react-native';
const deviceHeight = Dimensions.get('screen').height;
const toolH = ThemeVar.platform === 'ios' ? 40 : 40 + StatusBar.currentHeight;
const webviewH = deviceHeight - toolH;
export const CommonWebview = () => {
	const [curWallet] = useGetNodeWallet();
	const { params } = useRoute();
	const webview = useRef();
	const [url, setWebviewUrl] = useState(params.url);
	useEffect(() => {
		Base.navigator.setParams({
			...params,
			setWebviewUrl
		});
		try {
			const arr = url.split('//');
			const protocol = arr[0];
			Bridge.origin = `${protocol}//${arr[1].split('/')[0]}`;
		} catch (error) {
			Bridge.origin = '';
		}
		Bridge.injectJavaScript = (e) => webview.current.injectJavaScript(e);
	}, []);
	useEffect(async () => {
		if (curWallet.address) {
			const obj = {
				address: curWallet.address,
				nodeId: curWallet.nodeId
			};
			if (IotaSDK.checkWeb3Node(curWallet.nodeId)) {
				try {
					obj.chainId = await IotaSDK.client.eth.getChainId();
				} catch (error) {}
			}
			Bridge.accountsChanged(obj);
		}
	}, [curWallet.address + curWallet.nodeId]);
	return (
		<>
			<Container>
				<Nav
					leftIcon={null}
					title={params.title || ''}
					headerStyle={{ height: toolH }}
					rightContent={
						<Right>
							<Button
								onPress={() => {
									Base.goBack();
								}}
								style={{ marginRight: 0 }}
								transparent>
								<SvgIcon name='radio' size={18} color={ThemeVar.textColor} />
							</Button>
						</Right>
					}
				/>
				<WebView
					ref={webview}
					cacheEnabled={true}
					injectedJavaScript={Bridge.injectedJavaScript}
					onMessage={(e) => Bridge.onMessage(e)}
					style={{ flex: 1 }}
					source={{ uri: url }}
					startInLoadingState={true}
				/>
			</Container>
		</>
	);
};
