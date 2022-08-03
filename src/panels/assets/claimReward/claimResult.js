import React from 'react';
import { useGetNodeWallet } from '@tangle-pay/store/common';
import { Base, I18n } from '@tangle-pay/common';
import { Nav, SS } from '@/common';
import * as Yup from 'yup';
import { View, Text, Button, Container, Content } from 'native-base';
import { useRoute } from '@react-navigation/native';

const schema = Yup.object().shape({
	password: Yup.string().required()
});
export const ClaimResult = () => {
	const { params } = useRoute();
	const id = params.id;
	const [_, walletsList] = useGetNodeWallet();
	const curEdit = walletsList.find((e) => e.id === id) || {};
	const name = curEdit.name || '';
	return (
		<Container>
			<Nav title={name} />
			<Content style={[SS.p16]}>
				<Text style={[SS.fz16, SS.fw600, SS.pb16, { lineHeight: 24 }]}>Shimmer Staking Rewards Claimed</Text>
				<Text style={[SS.fz16, SS.fw600, SS.pb16, { lineHeight: 24 }]}>
					SMR数量：<Text style={[SS.cP]}>32983</Text>
				</Text>
				<Text style={[SS.fz16, SS.pb16, { lineHeight: 24 }]}>
					新创建的Shimmer钱包助记词与初始密码与您的IOTA钱包{' '}
					<Text style={[SS.fw600]}>
						{name} {Base.handleAddress(curEdit.address)}
					</Text>
					一致
				</Text>
				<Text style={[SS.fz16, SS.mb16, { lineHeight: 24 }]}>
					为了您的资产安全，建议您修改钱包密码或者将资产转移到全新的Shimmer钱包
				</Text>
				<View style={[{ marginTop: 138 }]}>
					<Button
						onPress={() => {
							Base.popToTop();
							Base.replace('main');
						}}
						color='primary'
						block>
						<Text>I Understand</Text>
					</Button>
				</View>
			</Content>
		</Container>
	);
};
