import React, { useState, useImperativeHandle } from 'react';
import { Container, Content, View, Text, Form, Item, Input, Button } from 'native-base';
import { Nav, S, SS, SvgIcon } from '@/common';

export const PasswordInput = ({ inputgRef }) => {
	const [showPwd, setShowPwd] = useState(false);
	useImperativeHandle(
		inputgRef,
		() => {
			return {
				handleChange
			};
		},
		[]
	);

	return (
		<>
			<Input
				keyboardType='ascii-capable'
				secureTextEntry={!showPwd}
				style={[SS.fz14, SS.pl0]}
				placeholder={I18n.t('assets.passwordTips')}
				onChangeText={handleChange('password')}
				value={values.password}
			/>
			<SvgIcon
				onPress={() => setShowPwd(!showPwd)}
				name={showPwd ? 'eye_1' : 'eye_0'}
				size={20}
				style={[SS.ml10]}
			/>
		</>
	);
};
