import React, { useState, useImperativeHandle } from 'react';
import { View, Text, Button } from 'native-base';
import Modal from 'react-native-modal';
import { I18n, Base } from '@tangle-pay/common';
import { S, SS, SvgIcon, ThemeVar } from '@/common';
export const TipsDialog = ({ dialogRef }) => {
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
			style={[SS.m0]}
			hasBackdrop
			backdropOpacity={0.3}
			onBackButtonPress={hide}
			onBackdropPress={hide}
			isVisible={isShow}>
			<View style={[SS.c, SS.w100]}>
				<View style={[SS.ph20, SS.pt50, SS.pb20, SS.w100, SS.radius10, SS.bgS, SS.mt70]}>
					<View style={[SS.mb20, SS.ac, SS.pv30, SS.ph50, SS.bgW, S.radius(10)]}>
						{/* <View>
							<Image style={[S.wh(55)]} source={images.com.no_screenshot} />
						</View> */}
						<SvgIcon size={55} name='no_screenshot' />
						<View style={[SS.mt20]}>
							<Text style={[SS.fz16, SS.fw500, SS.tc, SS.mb10]}>
								{I18n.t('account.backupScreenshoptTitle')}
							</Text>
							<Text style={[SS.fz14, SS.tc, SS.cS, S.lineHeight(20)]}>
								{I18n.t('account.backupScreenshoptTips')}
							</Text>
						</View>
					</View>
					<View style={[SS.ph20]}>
						<Button
							block
							onPress={() => {
								hide();
								Base.push('account/mnemonic');
							}}>
							<Text>{I18n.t('account.backupScreenshoptBtn')}</Text>
						</Button>
					</View>
				</View>
			</View>
		</Modal>
	);
};
