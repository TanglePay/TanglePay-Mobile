import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'native-base';
import { ThemeVar } from '../theme';

export const Line = ({ style }) => {
	return <View style={[styles.line, style]}></View>;
};
const styles = StyleSheet.create({
	line: {
		backgroundColor: ThemeVar.cardBorderColor,
		width: '100%',
		height: ThemeVar.borderWidth
	}
});
