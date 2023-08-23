import React, { useState, useImperativeHandle, useRef } from 'react';
import { View, Text, Button } from 'native-base';
import { I18n } from '@tangle-pay/common';
import Modal from 'react-native-modal';
import { S, SS } from '@/common/style/base.style';
export const SendConfirmDialog = ({ dialogRef,promise }) => {
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
	};
	const hide = () => {
		promise && promise.reject()
		setShow(false);
	};
	return (
		<Modal hasBackdrop backdropOpacity={0.3} onBackButtonPress={hide} onBackdropPress={hide} isVisible={isShow}>
			<View style={[SS.w100, SS.radius10, SS.bgW]}>
				
				<View style={[S.border(2)]}>
				<Text style={[SS.pv12, SS.ph16, SS.fz16, SS.fw600]}>
					{I18n.t('assets.sendConfirmation')}
				</Text>
				</View>
				
				<Text style={[SS.p16, SS.fz16, { lineHeight: 24 }]}>
					{I18n.t('assets.sendConfirmationTips')}
				</Text>
				<View style={[{ paddingVertical: 16 }, SS.row, S.border(2)]}>
					<Button bordered style={[SS.flex1, SS.c, { marginHorizontal: 10 }]} onPress={hide}>
						<Text>{I18n.t('apps.cancel')}</Text>
					</Button>
					<Button
						style={[SS.flex1, SS.c, { marginHorizontal: 10 }]}
						onPress={async () => {
							setShow(false);
							const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
							await sleep(500)
							promise && promise.resolve()
						}}>
						<Text>{I18n.t('apps.execute')}</Text>
					</Button>
				</View>
			</View>
		</Modal>
	);
};
