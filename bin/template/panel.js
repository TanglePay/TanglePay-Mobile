import React from 'react';
import { Container, Content, View, Text } from 'native-base';
import { StyleSheet } from 'react-native';
import { Base } from '@tangle-pay/common';
import { Nav } from '@/common';

export const 组件名称 = () => {
	return (
		<Container>
			<Nav title='页面名称' />
			<Content>
				<View></View>
			</Content>
		</Container>
	);
};

const styles = StyleSheet.create({});
