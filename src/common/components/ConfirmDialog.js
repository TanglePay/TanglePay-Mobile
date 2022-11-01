import React, { useState, useImperativeHandle, useRef } from 'react';
import { View, Text, Button, Switch } from 'native-base';
import { I18n } from '@tangle-pay/common';
import Modal from 'react-native-modal';
import { useStore } from '@tangle-pay/store';
import { S, SS } from '@/common/style/base.style';
export const ConfirmDialog = ({ dialogRef }) => {
	const [isShow, setShow] = useState(false);
	const [text, setText] = useState('');
	const [isPwdInput, setIsPwdInput] = useStore('common.pwdInput');
	const [isNotPrompt, setIsNotPrompt] = useStore('common.bioPrompt');
	const callBackRef = useRef(null);

	useImperativeHandle(
		dialogRef,
		() => {
			return {
				show
			};
		},
		[]
	);
	const show = (text, callBack) => {
		setText(text);
		setShow(true);
		callBackRef.current = callBack;
	};
	const hide = () => {
		setShow(false);
		callBackRef.current = null;
	};
	const switchOn = () => {
		if (isNotPrompt) {
			setIsPwdInput(false);
		}
		setIsNotPrompt(!isNotPrompt);
	};
	return (
		<Modal
			style={[SS.m0]}
			hasBackdrop
			backdropOpacity={0.3}
			onBackButtonPress={hide}
			onBackdropPress={hide}
			isVisible={isShow}>
			<View style={[SS.c, SS.w100, SS.ph30]}>
				<View style={[S.w('100%'), SS.radius10, SS.bgS]}>
					<View style={[SS.p20]}>
						<Text style={[SS.fz16]}>{text}</Text>
					</View>
					<View style={[SS.row, SS.je]}>
						<Text>{I18n.t('user.noPrompt')}</Text>
						<Switch value={isNotPrompt} onValueChange={switchOn} />
					</View>
					<View style={[SS.row, SS.je]}>
						<Button
							transparent
							onPress={() => {
								callBackRef.current && callBackRef.current();
								hide();
							}}>
							<Text>{I18n.t('assets.confirm')}</Text>
						</Button>
						<Button
							transparent
							onPress={() => {
								hide();
							}}>
							<Text>{I18n.t('account.nevermind')}</Text>
						</Button>
					</View>
				</View>
			</View>
		</Modal>
	);
};
