import React from 'react';
import { Container, Content, View, Text, Button } from 'native-base';
import { StyleSheet } from 'react-native';
import { Base, SS, S, ThemeVar, I18n, IotaSDK, Toast } from '@tangle-pay/common';
import { useStore } from '@tangle-pay/store';
import { useAddWallet } from '@tangle-pay/store/common';

export const AccountVerifySucc = () => {
	const addWallet = useAddWallet();
	const [registerInfo, seRegisterInfo] = useStore('common.registerInfo');
	return (
		<Container>
			<Content>
				<View style={[SS.p50, S.paddingT(ThemeVar.toolbarHeight)]}>
					<Text style={[SS.fz14]}>{I18n.t('account.registerSucc')}</Text>
					<Button
						block
						style={[SS.mt50]}
						onPress={async () => {
							try {
								Toast.showLoading();
								console.log(registerInfo);
								const res = await IotaSDK.importMnemonic(registerInfo);
								addWallet(res);
								seRegisterInfo({});
								Toast.hideLoading();
								Base.popToTop();
								Base.replace('main');
							} catch (error) {
								Toast.hideLoading();
								Base.goBack();
							}
						}}>
						<Text>{I18n.t('account.start')}</Text>
					</Button>
				</View>
			</Content>
		</Container>
	);
};

const styles = StyleSheet.create({});
