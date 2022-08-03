import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Base, I18n, IotaSDK } from '@tangle-pay/common';
import { useGetNodeWallet, useChangeNode } from '@tangle-pay/store/common';
import { Nav, NoData, SS, S, ThemeVar } from '@/common';
import { View, Text, Container, Content } from 'native-base';

const contentH = ThemeVar.deviceHeight;
export const ClaimReward = () => {
	let [, walletsList] = useGetNodeWallet();
	const changeNode = useChangeNode();
	const [curActive, setActive] = useState('');
	walletsList = walletsList.filter((e) => e.nodeId == 1);
	useEffect(() => {
		const id = (walletsList.find((e) => e.isSelected) || {}).id;
		setActive(id || '');
	}, [walletsList]);
	return (
		<Container>
			<Nav title={I18n.t('assets.myWallets')} />
			<Content style={[SS.ph16]}>
				<View style={{ overflowY: 'scroll', height: contentH - 48 - 60 }} className='ph20'>
					<Text style={[SS.fz17, SS.pt16]}>
						Choose a Wallet to <Text style={[SS.cP]}>Claim SMR Staking Rewards</Text>
					</Text>
					{walletsList.length > 0 ? (
						<View style={[SS.mb16]}>
							{walletsList.map((e) => {
								return (
									<TouchableOpacity
										activeOpacity={0.8}
										onPress={() => {
											Base.push('assets/claimReward/claimSMR', {
												id: e.id
											});
										}}
										key={e.id}
										style={[SS.radius8, SS.p16, SS.mt16, S.border(4, '#000')]}>
										<View style={[SS.row, SS.ac, SS.jsb]}>
											<Text style={[SS.fz18, SS.fw600]}>{e.name}</Text>
											<Text style={[SS.fz16, SS.cS]}>{Base.handleAddress(e.address)}</Text>
										</View>
									</TouchableOpacity>
								);
							})}
						</View>
					) : (
						<View className='mt60'>
							<NoData />
						</View>
					)}
					<Text style={[SS.fz17]}>
						<Text>如果你要Claim收益的IOTA钱包不在列表内，请先在Tanglepay中 </Text>
						<Text
							style={[SS.cP]}
							onPress={async () => {
								await changeNode(IotaSDK.IOTA_NODE_ID);
								Base.push('account/into', { type: 1, from: 'smr' });
							}}>
							导入IOTA钱包
						</Text>
					</Text>
				</View>
			</Content>
		</Container>
	);
};
