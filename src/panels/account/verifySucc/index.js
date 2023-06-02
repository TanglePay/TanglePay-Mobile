import React from 'react';
import { Container, Content, View, Text, Button } from 'native-base';
import { Base, I18n, IotaSDK } from '@tangle-pay/common';
import { useStore } from '@tangle-pay/store';
import { useAddWallet } from '@tangle-pay/store/common';
import { S, SS, ThemeVar, Toast } from '@/common';
import { markWalletPasswordEnabled } from '@tangle-pay/domain';

export const AccountVerifySucc = () => {
	const addWallet = useAddWallet();
	const [registerInfo, seRegisterInfo] = useStore('common.registerInfo');
	const registerSucc = I18n.t('account.registerSucc');
	const arr = registerSucc.match(/\<##.+?##\>/g) || [];
	const arr1 = registerSucc.split(/\<##.+?##\>/g);
	const textArr = [];
	arr1.forEach((e, i) => {
		textArr.push(e);
		arr[i] && textArr.push(arr[i]);
	});
	return (
		<Container>
			<Content contentContainerStyle={[SS.p50, SS.pb100, S.paddingT(ThemeVar.toolbarHeight)]}>
				<View>
					{textArr.map((e, i) => {
						if (/^\<##/.test(e)) {
							return (
								<Text key={i} style={[SS.fz17, { fontWeight: 'bold' }]}>
									{e.replace(/[\<##|##\>]/g, '')}
								</Text>
							);
						} else {
							return (
								<Text key={i} style={[SS.fz14]}>
									{e}
								</Text>
							);
						}
					})}
				</View>
				<Button
					block
					style={[SS.mt50]}
					onPress={async () => {
						try {
							Toast.showLoading();
							console.log(registerInfo);
							const res = await IotaSDK.importMnemonic(registerInfo);
							if (registerInfo.passwordIsPassword) {
								await markWalletPasswordEnabled(res.id);
							}
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
				{/* </View> */}
			</Content>
		</Container>
	);
};
