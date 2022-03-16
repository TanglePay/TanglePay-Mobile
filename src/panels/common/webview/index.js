import React, { useEffect, useState } from 'react';
import { Container, Content } from 'native-base';
import { useRoute } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { Nav, ThemeVar } from '@/common';
import { Base } from '@tangle-pay/common';

export const CommonWebview = () => {
	const { params } = useRoute();
	const [url, setWebviewUrl] = useState(params.url);
	useEffect(() => {
		Base.navigator.setParams({
			...params,
			setWebviewUrl
		});
		console.log(Base.navigator.getCurrentRoute(), '----++-');

		// Base.addEvt('WebViewChangeUrl', (url) => {
		// 	setUrl(url);
		// });
		// console.log(Base.navigator);
		// return () => {
		// 	Base.removeEvt('WebViewChangeUrl');
		// };
	}, []);
	return (
		<Container>
			<Nav title={params.title || ''} />
			<Content>
				<WebView style={{ height: ThemeVar.contentHeight }} source={{ uri: url }} />
			</Content>
		</Container>
	);
};
