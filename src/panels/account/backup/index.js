import React, { useRef } from 'react';
import { Container, Content, View, Text, Button } from 'native-base';
import { StyleSheet, Image } from 'react-native';
import { Base, Nav1, SS, S, I18n, images } from '@tangle-pay/common';
import { TipsDialog } from './tipsDialog';

export const AccountBackup = () => {
	const dialogRef = useRef();
	const handleNext = () => {
		dialogRef.current.show();
	};
	return (
		<Container>
			<Nav1 title={I18n.t('account.backupTitle')} />
			<Content>
				<View style={[SS.c, SS.pv70]}>
					<Image style={[S.wh(60, 55)]} source={images.com.encrypt}></Image>
				</View>
				<View style={[SS.ph50, SS.pb30]}>
					<View style={[SS.mb30]}>
						<Text style={[SS.fz16, SS.fw500]}>{I18n.t('account.backupTips')}</Text>
					</View>
					<View style={[S.marginB(100)]}>
						<Text style={[SS.fz14, S.lineHeight(20)]}>{I18n.t('account.backupTipsContent')}</Text>
					</View>
					<Button block onPress={handleNext}>
						<Text>{I18n.t('account.next')}</Text>
					</Button>
				</View>
			</Content>
			<TipsDialog dialogRef={dialogRef} />
		</Container>
	);
};

const styles = StyleSheet.create({});
