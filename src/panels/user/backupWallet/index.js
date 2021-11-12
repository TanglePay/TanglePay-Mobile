import React from 'react';
import { Container, Content, View, Text, Button } from 'native-base';
import { StyleSheet } from 'react-native';
import { Base, Nav, I18n, S, SS, ThemeVar } from '@tangle-pay/common';

export const UserBackupWallet = () => {
	return (
		<Container>
			<Nav title={I18n.t('user.backupWallet')} />
			<Content>
				<View style={[SS.pt40, SS.ph50, SS.jsb, SS.ac, S.h(ThemeVar.contentHeight - 200)]}>
					<Text style={[SS.fz15, SS.tc, SS.cS, S.lineHeight(20)]}>{I18n.t('user.backupWalletTips')}</Text>
					<Button block>
						<Text>{I18n.t('user.export')}</Text>
					</Button>
				</View>
			</Content>
		</Container>
	);
};

const styles = StyleSheet.create({});
