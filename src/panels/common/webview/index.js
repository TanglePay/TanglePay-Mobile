import React from 'react';
import { Container, Content, View, Text } from 'native-base';
import { StyleSheet } from 'react-native';
import { Base, Nav, ThemeVar } from '@tangle-pay/common';
import { useRoute } from '@react-navigation/native';
import { WebView } from 'react-native-webview';

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

const styles = StyleSheet.create({});
