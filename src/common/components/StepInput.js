import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { Input, Text, View } from 'native-base';
import { S, SS, SvgIcon } from '@/common';
import { ThemeVar } from '../style/theme';
import BigNumber from 'bignumber.js';
import { IotaSDK } from '@tangle-pay/common';

export const StepInput = (props) => {
	const { value, onChangeText } = props;
	const [inputValue, setValue] = useState(value);
	useEffect(() => {
		setValue(value);
	}, [value]);
	useEffect(() => {
		onChangeText(inputValue);
	}, [inputValue]);
	const handleReduce = () => {
		if (inputValue && inputValue > 0) {
			setValue(IotaSDK.getNumberStr(BigNumber(inputValue).minus(1).valueOf()));
		}
	};
	const handlePlus = () => {
		setValue(IotaSDK.getNumberStr(BigNumber(inputValue).plus(1).valueOf()));
	};
	return (
		<View style={[SS.row, SS.ac]}>
			<Input
				value={String(inputValue)}
				onChangeText={(e) => {
					e = String(e).replace(/[^0-9\.]/, '');
					if (e.split('.').length > 2) {
						const arr = e.split('.');
						e = `${arr[0]}.${arr.slice(1).join('')}`;
					}
					onChangeText(e);
				}}
				maxLength={12}
				keyboardType='numeric'
				style={[SS.mr12, SS.pl0]}
			/>
			<TouchableOpacity disabled={!inputValue || inputValue <= 0} onPress={handleReduce} style={[SS.mr12]}>
				<SvgIcon color={ThemeVar.brandPrimary} size={20} name='minus_circle' />
			</TouchableOpacity>
			<TouchableOpacity onPress={handlePlus}>
				<SvgIcon color={ThemeVar.brandPrimary} size={20} name='add_circle' />
			</TouchableOpacity>
		</View>
	);
};
