import React, { useEffect, useState, useRef } from 'react';
import { Container, Content } from 'native-base';
import { useRoute } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { Nav, ThemeVar } from '@/common';
import { Base } from '@tangle-pay/common';
import { Bridge } from '@/common/bridge';

export const CommonWebview = () => {
	const dappDialog = useRef();
	const { params } = useRoute();
	const webview = useRef();
	const [url, setWebviewUrl] = useState(params.url);
	useEffect(() => {
		Base.navigator.setParams({
			...params,
			setWebviewUrl
		});
		Bridge.injectJavaScript = (e) => webview.current.injectJavaScript(e);
		// Bridge.dappDialog = dappDialog.current;
	}, []);
	return (
		<>
			<Container>
				<Nav title={params.title || ''} />
				<Content>
					<WebView
						ref={webview}
						injectedJavaScript={Bridge.injectedJavaScript}
						onMessage={(e) => Bridge.onMessage(e)}
						style={{ height: ThemeVar.contentHeight }}
						source={{ uri: url }}
					/>
				</Content>
			</Container>
		</>
	);
};
