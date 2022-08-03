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
				<View style={[SS.ph24, SS.w100, SS.flex1]}>
					<View style={[SS.flex1, SS.c]}>
						<Text style={[SS.fz32, SS.fw600, SS.mb32, SS.tc]}>
							{I18n.t('account.title')
								.split('##')
								.filter((e) => !!e)
								.map((e, i) => {
									return (
										<Text key={i} style={[{ fontSize: 32 }, SS.fw600, i == 0 ? SS.cP : SS.cB]}>
											{e}
										</Text>
									);
								})}
						</Text>
						<Text style={titleStyle}>{I18n.t('account.subTitle')}</Text>
					</View>
					<View style={[{ marginBottom: 128 }]}>
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
	SS.fz14,
	SS.tc,
	{
		color: '#333',
		lineHeight: 18
	}
]);
