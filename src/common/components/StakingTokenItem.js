import React from 'react';
import { View, Text } from 'native-base';
import { Image } from 'react-native';
import { S, SS } from '@/common/style/base.style';
import { Base } from '@tangle-pay/common';

export const StakingTokenItem = ({ coin, label, style = [] }) => {
	return (
		<View style={[SS.row, SS.ac, S.radius(20), S.border(4), SS.bgW, ...style]}>
			<Image style={[S.wh(24)]} source={{ uri: Base.getIcon(coin) }} />
			<Text style={[SS.fz12, SS.mh5]}>{label || coin}</Text>
		</View>
	);
};
