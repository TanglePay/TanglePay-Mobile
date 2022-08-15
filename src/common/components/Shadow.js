import React from 'react';
import { Image } from 'react-native';
import { View } from 'native-base';
import { SS, ThemeVar } from '@/common';
const shadowImg = require('../assets/shadow.png');
const h = (ThemeVar.deviceWidth * 36) / 1125;
export default ({ children }) => {
	return (
		<View style={[SS.pr]}>
			<Image
				source={shadowImg}
				style={[SS.pa, { width: ThemeVar.deviceWidth, zIndex: -1, height: h, top: -h }]}
			/>
			{children}
		</View>
	);
};
