import React, { useState, useImperativeHandle } from 'react';
import { View, Text } from 'native-base';
import { TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { I18n, Base, IotaSDK } from '@tangle-pay/common';
import { S, SS, Toast } from '@/common';
import { useStore } from '@tangle-pay/store';
export const IntoDialog = ({ dialogRef }) => {
	const [curNodeId] = useStore('common.curNodeId');
	const curNode = IotaSDK.nodes.find((e) => e.id == curNodeId) || {};
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
		setShow(false);
	};
	return (
		<Modal
			style={[SS.m0, SS.je]}
			hasBackdrop
			backdropOpacity={0.3}
			onBackButtonPress={hide}
			onBackdropPress={hide}
			isVisible={isShow}>
			<View style={[SS.p24, SS.w100, { borderTopLeftRadius: 24, borderTopRightRadius: 24 }, SS.bgS]}>
				<Text style={[SS.fz16, SS.fw600, SS.tc]}>{I18n.t('account.intoBtn')}</Text>
				<View style={[SS.mt24, SS.bgW, SS.radius10]}>
					<TouchableOpacity
						activeOpacity={0.9}
						onPress={() => {
							hide();
							Base.push('account/into', { type: 1 });
						}}
						style={[SS.pl24, SS.row, SS.ac, { height: 70 }]}>
						<Text style={[SS.fz16]}>{I18n.t('account.intoTitle1')}</Text>
					</TouchableOpacity>
					{curNode?.type == 1 && (
						<TouchableOpacity
							activeOpacity={0.9}
							onPress={() => {
								hide();
								Toast.show(I18n.t('account.unopen'));
								// Base.push('account/into', { type: 2 });
							}}
							style={[SS.pl24, SS.row, SS.ac, { height: 70 }, S.border(0)]}>
							<Text style={[SS.fz16]}>{I18n.t('account.intoTitle2')}</Text>
						</TouchableOpacity>
					)}
					{curNode?.type == 2 && (
						<TouchableOpacity
							activeOpacity={0.9}
							onPress={() => {
								hide();
								Base.push('account/into/privateKey');
							}}
							style={[SS.pl24, SS.row, SS.ac, { height: 70 }, S.border(0)]}>
							<Text style={[SS.fz17]}>{I18n.t('account.privateKeyImport')}</Text>
						</TouchableOpacity>
					)}
				</View>
			</View>
		</Modal>
	);
};
