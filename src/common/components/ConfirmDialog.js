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
		setIsNotPrompt(true);
	};
	return (
		<Modal hasBackdrop backdropOpacity={0.3} onBackButtonPress={hide} onBackdropPress={hide} isVisible={isShow}>
			<View style={[SS.w100, SS.radius10, SS.bgW]}>
				<Text style={[SS.pv12, SS.ph16, SS.fz16, SS.fw600, S.border(2)]}>
					{I18n.t('user.enableBiometrics')}
				</Text>
				<Text style={[SS.p16, SS.fz16, { lineHeight: 24 }]}>
					{I18n.t('user.biometriceDialog')
						.split('##')
						.filter((e) => !!e)
						.map((e, i) => {
							return (
								<Text style={i === 1 ? [SS.fw600, SS.cP] : []} key={i}>
									{e}
								</Text>
							);
						})}
				</Text>
				<View style={[{ paddingVertical: 16 }, SS.row, S.border(2)]}>
					<Button bordered style={[SS.flex1, SS.c, { marginHorizontal: 10 }]} onPress={hide}>
						<Text>{I18n.t('apps.cancel')}</Text>
					</Button>
					<Button
						style={[SS.flex1, SS.c, { marginHorizontal: 10 }]}
						onPress={() => {
							callBackRef.current && callBackRef.current();
							hide();
						}}>
						<Text>{I18n.t('assets.confirm')}</Text>
					</Button>
				</View>
				<View style={[S.marginV(10), SS.row, SS.je]}>
					<Text style={[{ paddingHorizontal: 16 }]} onPress={switchOn}>
						{I18n.t('user.noPrompt')}
					</Text>
				</View>
			</View>
		</Modal>
		// <Modal hasBackdrop backdropOpacity={0.3} onBackButtonPress={hide} onBackdropPress={hide} isVisible={isShow}>
		// 	<View style={[SS.w100, SS.radius10, SS.bgW]}>
		// 		<Text style={[SS.pv12, SS.ph16, SS.fz16, SS.fw600, S.border(2)]}>
		// 			{I18n.t('user.enableBiometrics')}
		// 		</Text>
		// 		<View style={[S.w('100%'), SS.radius10, SS.bgS]}>
		// 			<View style={[SS.p20]}>
		// 				<Text style={[SS.fz16]}>{text}</Text>
		// 			</View>
		// 			<View style={[SS.row, SS.je]}>
		// 				<Text>{I18n.t('user.noPrompt')}</Text>
		// 				<Switch value={isNotPrompt} onValueChange={switchOn} />
		// 			</View>
		// 			<View style={[SS.row, SS.je]}>
		// 				<Button
		// 					transparent
		// 					onPress={() => {
		// 						callBackRef.current && callBackRef.current();
		// 						hide();
		// 					}}>
		// 					<Text>{I18n.t('assets.confirm')}</Text>
		// 				</Button>
		// 				<Button
		// 					transparent
		// 					onPress={() => {
		// 						hide();
		// 					}}>
		// 					<Text>{I18n.t('account.nevermind')}</Text>
		// 				</Button>
		// 			</View>
		// 		</View>
		// 	</View>
		// </Modal>
	);
};
