import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { Input, Text, View } from 'native-base';
import { S, SS } from '@/common';
import { ThemeVar } from '../style/theme';
import BigNumber from 'bignumber.js';

export const StepInput = (props) => {
	const { value, onChangeText } = props;
	const [inputValue, setValue] = useState(value);
	useEffect(() => {
		setValue(value);
	}, [value]);
	const handleReduce = () => {
		if (inputValue && inputValue > 0) {
			setValue(BigNumber(inputValue).minus(1).valueOf());
		}
	};
	const handlePlus = () => {
		setValue(BigNumber(inputValue).plus(1).valueOf());
	};
	return (
		<View style={[SS.row, SS.ac]}>
			<Input
				value={String(inputValue)}
				onChangeText={(e) => {
					onChangeText(e);
				}}
				keyboardType='numeric'
				style={[SS.mr12, SS.pl0]}
			/>
			<TouchableOpacity
				disabled={!inputValue || inputValue <= 0}
				onPress={handleReduce}
				style={[{ borderRadius: 24 }, S.wh(24), SS.bgW, S.border(4, ThemeVar.brandPrimary, 1), SS.c, SS.mr12]}>
				<Text style={[{ fontSize: 22, lineHeight: 22 }, SS.fw600, SS.cP]}>-</Text>
			</TouchableOpacity>
			<TouchableOpacity
				onPress={handlePlus}
				style={[{ borderRadius: 24 }, S.wh(24), SS.bgW, S.border(4, ThemeVar.brandPrimary, 1), SS.c]}>
				<Text style={[{ fontSize: 18, lineHeight: 20 }, SS.fw600, SS.cP]}>+</Text>
			</TouchableOpacity>
		</View>
	);
};
