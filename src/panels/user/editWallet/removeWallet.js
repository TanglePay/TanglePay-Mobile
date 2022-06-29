import React from 'react';
import { Container, Content, View, Text, Input, Button } from 'native-base';
import { Base, I18n } from '@tangle-pay/common';
import { useRoute } from '@react-navigation/native';
import { useGetNodeWallet, useRemoveWallet } from '@tangle-pay/store/common';
import { Nav, S, SS } from '@/common';

export const RemoveWallet = () => {
	const { params } = useRoute();
	const id = params.id;
	const [_, walletsList] = useGetNodeWallet();
	const curEdit = walletsList.find((e) => e.id === id) || {};
	const name = curEdit.name || '';
	const removeWallet = useRemoveWallet();
	return (
		<Container>
			<Nav title={name} />
			<Content>
				<View style={[SS.p20]}>
					<View style={[S.border(4), SS.radius10, SS.p10]}>
						<Text style={[SS.fz13, SS.cS, S.lineHeight(20)]}>{curEdit.address}</Text>
					</View>
				</View>
				<View style={[SS.ph20]}>
					<View style={[SS.c, SS.pv20]}>
						<Text style={[SS.fz18, SS.fw600]}>{I18n.t('account.removeTitle')}</Text>
					</View>
					<View style={[SS.mb20, S.bg('rgba(213, 53, 84, 0.05)'), SS.radius10, SS.p10]}>
						<Text style={[SS.fz14, S.color('#D53554')]}>{I18n.t('account.removeTips')}</Text>
					</View>
				</View>
				<View style={[SS.row, SS.jsb, SS.p20]}>
					<Button
						onPress={() => {
							removeWallet(id);
							Base.goBack(2);
							setTimeout(() => {
								Base.push('assets/wallets');
							}, 0);
						}}
						style={[SS.flex1, S.h(44), SS.radius10]}
						block>
						<Text>{I18n.t('account.remove')}</Text>
					</Button>
				</View>
			</Content>
		</Container>
	);
};
