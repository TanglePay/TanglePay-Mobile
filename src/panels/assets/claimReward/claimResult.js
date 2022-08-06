import React from 'react';
import { useGetNodeWallet } from '@tangle-pay/store/common';
import { Base, I18n } from '@tangle-pay/common';
import { Nav, SS } from '@/common';
import { View, Text, Button, Container, Content } from 'native-base';
import { useRoute } from '@react-navigation/native';

export const ClaimResult = () => {
	const { params } = useRoute();
	const id = params.id;
	const amount = params.amount;
	const [_, walletsList] = useGetNodeWallet();
	const curEdit = walletsList.find((e) => e.id === id) || {};
	const name = curEdit.name || '';
	return (
		<Container>
			<Nav title={name} />
			<Content style={[SS.p16]}>
				<Text style={[SS.fz16, SS.fw600, SS.pb16, { lineHeight: 24 }]}>
					{I18n.t('shimmer.smrClaimStakingReward')}
				</Text>
				<Text style={[SS.fz16, SS.fw600, SS.pb16, { lineHeight: 24 }]}>
					{I18n.t('shimmer.smrAmount')}
					<Text style={[SS.cP]}>{amount}</Text>
				</Text>
				<Text style={[SS.fz16, SS.pb16, { lineHeight: 24 }]}>
					{I18n.t('shimmer.createTips')
						.replace('{name}', name)
						.replace('{address}', Base.handleAddress(curEdit.address))
						.split('##')
						.filter((e) => !!e)
						.map((e, i) => {
							return (
								<Text style={[i === 1 ? SS.fw600 : null]} key={i}>
									{e}
								</Text>
							);
						})}
				</Text>
				<Text style={[SS.fz16, SS.mb16, { lineHeight: 24 }]}>{I18n.t('shimmer.createSuccTips')}</Text>
				<View style={[{ marginTop: 138 }]}>
					<Button
						onPress={() => {
							Base.popToTop();
							Base.replace('main');
						}}
						color='primary'
						block>
						<Text>{I18n.t('shimmer.understand')}</Text>
					</Button>
				</View>
			</Content>
		</Container>
	);
};
