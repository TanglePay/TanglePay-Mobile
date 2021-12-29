import React, { useState, useImperativeHandle } from 'react';
import { View, Text } from 'native-base';
import { TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { I18n, Base } from '@tangle-pay/common';
import { S, SS, Toast } from '@/common';
export const AddDialog = ({ dialogRef }) => {
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
			<View style={[SS.ph20, SS.w100, SS.radius10, SS.bgS]}>
				<View style={[SS.c, SS.pv15]}>
					<Text style={[SS.fz16, SS.cS]}>{I18n.t('assets.addWallets')}</Text>
				</View>
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => {
						hide();
						Base.push('account/register');
					}}
					style={[SS.pv30, SS.c, SS.bgW, SS.radius10]}>
					<Text style={[SS.fz18]}>{I18n.t('account.createTitle')}</Text>
				</TouchableOpacity>
				<Text style={[SS.fz16, SS.cS, SS.mt20, SS.mb10]}>{I18n.t('account.intoBtn')}</Text>
				<View style={[SS.mb50, SS.bgW, SS.radius10]}>
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => {
							hide();
							Base.push('account/into', { type: 1 });
						}}
						style={[SS.pv30, SS.c]}>
						<Text style={[SS.fz18]}>{I18n.t('account.intoTitle1')}</Text>
					</TouchableOpacity>
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => {
							hide();
							Toast.show(I18n.t('account.unopen'));
							// Base.push('account/into', { type: 2 });
						}}
						style={[SS.pv30, SS.c, S.border(0)]}>
						<Text style={[SS.fz18]}>{I18n.t('account.intoTitle2')}</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
};
