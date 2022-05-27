import React, { useState } from 'react';
import { Container, Content, View, Text, Input, Button } from 'native-base';
import { TouchableOpacity } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { Base, I18n, IotaSDK } from '@tangle-pay/common';
import { useRoute } from '@react-navigation/native';
import { useGetNodeWallet } from '@tangle-pay/store/common';
import { Nav, S, SS, Toast } from '@/common';

export const PrivateKey = () => {
	const { params } = useRoute();
	const id = params.id;
	const [password, setPassword] = useState('');
	const [keyStr, setKeyStr] = useState('');
	const [_, walletsList] = useGetNodeWallet();
	const curEdit = walletsList.find((e) => e.id === id) || {};
	const name = curEdit.name || '';
	return (
		<Container>
			<Nav title={name} />
			<Content>
				<View style={[SS.p20, S.border(2)]}>
					<View style={[S.border(4), SS.radius10, SS.p10]}>
						<Text style={[SS.fz13, SS.cS, S.lineHeight(20)]}>{curEdit.address}</Text>
					</View>
				</View>
				<View style={[SS.ph20]}>
					<View style={[SS.c, SS.pv20]}>
						<Text style={[SS.fz18]}>{I18n.t('account.showKey')}</Text>
					</View>
					<View>
						<Text style={[SS.fz14]}>
							{I18n.t(keyStr ? 'account.copyKeyTips' : 'account.showKeyInputPassword')}
						</Text>
						{!keyStr ? (
							<Input
								secureTextEntry
								value={password}
								onChangeText={setPassword}
								style={[S.border(2, '#ddd', 1), SS.mt15]}
							/>
						) : (
							<Text
								onPress={() => {
									Clipboard.setString(keyStr);
									Toast.success(I18n.t('assets.copied'));
								}}
								style={[SS.fz14, SS.pt20, SS.fw500, S.lineHeight(24)]}>
								{keyStr}
							</Text>
						)}
					</View>
					<View style={[SS.mv20, S.bg('rgba(213, 53, 84, 0.05)'), SS.radius10, SS.p10]}>
						<Text style={[SS.fz14, S.color('#D53554')]}>{I18n.t('account.showKeyTips')}</Text>
					</View>
					{!keyStr ? (
						<View style={[SS.row, SS.jsb]}>
							<Button style={[SS.flex1, SS.mr10, S.h(44), SS.radius10]} block bordered>
								<Text>{I18n.t('apps.cancel')}</Text>
							</Button>
							<Button
								onPress={() => {
									try {
										const privateKeyStr = IotaSDK.getPrivateKey(curEdit.seed, password);
										setKeyStr(privateKeyStr);
									} catch (error) {
										return Toast.error(I18n.t('assets.passwordError'));
									}
								}}
								style={[SS.flex1, SS.ml10, S.h(44), SS.radius10]}
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
