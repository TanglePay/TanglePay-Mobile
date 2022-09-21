import React, { useState, useImperativeHandle } from 'react';
import { View, Text, Button } from 'native-base';
import Modal from 'react-native-modal';
import { I18n, IotaSDK } from '@tangle-pay/common';
import { S, SS } from '@/common';

export const ExpDialog = ({ dialogRef, data }) => {
	const [expStr, setExpStr] = useState('');
	const [isShow, setShow] = useState(false);
	useImperativeHandle(
		dialogRef,
		() => {
			return {
				show
			};
		},
		[]
	);
	const show = () => {
		setShow(true);
		setExpStr(IotaSDK.getMnemonic());
	};
	const hide = () => {
		setShow(false);
	};
	return (
		<Modal hasBackdrop backdropOpacity={0.3} onBackButtonPress={hide} onBackdropPress={hide} isVisible={isShow}>
			<View style={[SS.w100, SS.radius10, SS.bgW]}>
				<View style={[SS.bgW, { borderRadius: 16 }]}>
					<View style={[SS.ph16, SS.pv12, S.border(2)]}>
						<Text style={[SS.fz16, SS.fw600]}>{I18n.t('account.mnemonicExp')}</Text>
					</View>
					<View style={[SS.p16]}>
						<View style={[SS.p16, SS.pt10, SS.radius10, S.border(4, '#000', 1), { lineHeight: 20 }]}>
							<Text style={[SS.fz14]}>{expStr}</Text>
						</View>
						<View style={[SS.pt16]}>
							<Button block onPress={hide} color='primary' size='large'>
								<Text>{I18n.t('shimmer.understand')}</Text>
							</Button>
						</View>
					</View>
				</View>
			</View>
		</Modal>
	);
};
