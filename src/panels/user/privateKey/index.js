import React, { useState, useEffect } from 'react';
import { Container, Content, View, Text, Input, Button } from 'native-base';
import Clipboard from '@react-native-clipboard/clipboard';
import { Base, I18n, IotaSDK } from '@tangle-pay/common';
import { useRoute } from '@react-navigation/native';
import { useGetNodeWallet } from '@tangle-pay/store/common';
import { Nav, S, SS, Toast } from '@/common';
import { context, checkWalletIsPasswordEnabled } from '@tangle-pay/domain';

export const PrivateKey = () => {
	const { params } = useRoute();
	const id = params.id;
	const [password, setPassword] = useState('');
	const [keyStr, setKeyStr] = useState(' ');
	const [_, walletsList] = useGetNodeWallet();
	const curEdit = walletsList.find((e) => e.id === id) || {};
	const name = curEdit.name || '';
	useEffect(() => {
		const func = async () => {
			const isEnabled = await checkWalletIsPasswordEnabled(curEdit.id);
			if (!isEnabled && context.state.isPinSet) {
				const privateKeyStr = await IotaSDK.getPrivateKey(curEdit.seed, context.state.pin, curEdit.path);
				setKeyStr(privateKeyStr.replace(/^0x/, ''));
			} else {
				setKeyStr('');
			}
		};
		func();
	}, []);
	return (
		<Container>
			<Nav title={name} />
			<Content>
				<View style={[SS.p16]}>
					<View style={[S.border(4), SS.radius8, SS.p8]}>
						<Text style={[SS.fz14, S.lineHeight(18)]}>{curEdit.address}</Text>
					</View>
				</View>
				<View style={[SS.ph15]}>
					<View style={[SS.c, SS.pv24]}>
						<Text style={[SS.fz16, SS.fw600]}>{I18n.t('account.showKey')}</Text>
					</View>
					<View>
						<Text style={[SS.fz14]}>
							{I18n.t(keyStr ? 'account.copyKeyTips' : 'assets.passwordTips').replace('{name}', name)}
						</Text>
						{!keyStr ? (
							<Input
								secureTextEntry
								value={password}
								onChangeText={setPassword}
								style={[S.border(2, '#ddd', 1), SS.mt15, SS.mb8]}
							/>
						) : (
							<Text
								onPress={() => {
									Clipboard.setString(keyStr);
									Toast.success(I18n.t('assets.copied'));
								}}
								style={[SS.fz14, SS.pt8, SS.fw600, S.lineHeight(18)]}>
								{keyStr}
							</Text>
						)}
					</View>
					<View style={[SS.mt16, SS.mb32, S.bg('rgba(213, 53, 84, 0.05)'), SS.radius10, SS.p10]}>
						<Text style={[SS.fz14, S.color('#D53554')]}>{I18n.t('account.showKeyTips')}</Text>
					</View>
					{!keyStr ? (
						<View style={[SS.row, SS.jsb]}>
							<Button
								onPress={async () => {
									try {
										const privateKeyStr = await IotaSDK.getPrivateKey(
											curEdit.seed,
											password,
											curEdit.path
										);
										setKeyStr(privateKeyStr.replace(/^0x/, ''));
									} catch (error) {
										return Toast.error(I18n.t('assets.passwordError'));
									}
								}}
								style={[SS.flex1, S.h(44), SS.radius10]}
								disabled={!password}
								block>
								<Text>{I18n.t('apps.execute')}</Text>
							</Button>
						</View>
					) : (
						<View style={[SS.row, SS.jsb]}>
							<Button
								onPress={() => {
									Base.goBack();
								}}
								style={[SS.flex1, S.h(44), SS.radius10]}
								block>
								<Text>{I18n.t('account.done')}</Text>
							</Button>
						</View>
					)}
				</View>
			</Content>
		</Container>
	);
};
