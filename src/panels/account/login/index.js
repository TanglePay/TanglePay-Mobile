import React, { useRef } from 'react';
import { Container, View, Text, Button } from 'native-base';
import { StyleSheet } from 'react-native';
import { Base, I18n } from '@tangle-pay/common';
import { IntoDialog } from './intoDialog';
import { SS, Nav } from '@/common';
export const AccountLogin = () => {
	const dialogRef = useRef();
	return (
		<Container>
			<Nav title='' headerStyle={{ borderBottomWidth: 0 }} />
			<View style={[SS.flex1, SS.ac, SS.je]}>
				<View style={[SS.mb40, SS.ph60, SS.w100]}>
					<Text style={[SS.fz26, SS.fw500, SS.mb20, SS.tc]}>{I18n.t('account.title')}</Text>
					<Text style={titleStyle}>{I18n.t('account.subTitle')}</Text>
					<View style={[SS.mt70, SS.pt60, SS.pb70]}>
						<Button
							block
							onPress={() => {
								Base.push('account/register');
							}}>
							<Text>{I18n.t('account.create')}</Text>
						</Button>
						<Button
							style={[SS.mt20]}
							transparent
							block
							onPress={() => {
								dialogRef.current.show();
							}}>
							<Text>{I18n.t('account.hasWallet')}</Text>
						</Button>
					</View>
				</View>
			</View>
			<IntoDialog dialogRef={dialogRef} />
		</Container>
	);
};

const titleStyle = StyleSheet.flatten([
	SS.fz15,
	SS.tc,
	{
		color: '#333',
		lineHeight: 24
	}
]);
