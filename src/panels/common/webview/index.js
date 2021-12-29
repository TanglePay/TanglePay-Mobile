import React from 'react';
import { Container, Content } from 'native-base';
import { useRoute } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { Nav, ThemeVar } from '@/common';

export const CommonWebview = () => {
	const { params } = useRoute();
	console.log(params.url);
	return (
		<Container>
			<Nav title={params.title || ''} />
			<Content>
				<WebView style={{ height: ThemeVar.contentHeight }} source={{ uri: params.url }} />
			</Content>
		</Container>
	);
};
