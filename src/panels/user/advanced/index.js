import React, { useState, useEffect } from 'react';
import { Container, Content, View, Text, Switch } from 'native-base';
import { I18n, IotaSDK, Base } from '@tangle-pay/common';
import { useStore } from '@tangle-pay/store';
import { S, SS, Nav } from '@/common';
import { useChangeNode } from '@tangle-pay/store/common';

export const UserAdvanced = () => {
	const changeNode = useChangeNode();
	const [_, changeWalletList] = useStore('common.walletsList');
	const [shimmerSupport, setShimmerSupport] = useState(false);
	const [iotaSupport, setIotaSupport] = useState(false);
	const [polyganSupport, setPolyganSupport] = useState(false);
	const dispatch = (key, data) => {
		if (Base.globalDispatch) {
			Base.globalDispatch({
				type: key,
				data
			});
		}
	};
	useEffect(() => {
		Base.getLocalData('common.shimmerSupport').then((res) => {
			setShimmerSupport(res == 1);
		});
		// Base.getLocalData('common.iotaSupport').then((res) => {
		// 	setIotaSupport(res == 1);
		// });
		Base.getLocalData('common.polyganSupport').then((res) => {
			setPolyganSupport(res == 1);
		});
	}, []);
	const handleChange = async () => {
		await IotaSDK.getNodes();
		const newWalletList = await IotaSDK.getWalletList();
		const curNodeId = await Base.getLocalData('common.curNodeId');
		if (!curNodeId) {
			changeNode(IotaSDK.IOTA_NODE_ID);
		}
		changeWalletList(newWalletList);
	};
	return (
		<Container>
			<Nav title='Advanced' />
			<Content>
				<View activeOpacity={0.8} style={[SS.p16, S.border(2), SS.row, SS.ac, SS.jsb]}>
					<Text style={[SS.fz16]}>Support Shimmer Testnet</Text>
					<Switch
						value={shimmerSupport}
						onValueChange={async (e) => {
							setShimmerSupport(e);
							Base.setLocalData('common.shimmerSupport', e ? 1 : 0);
							dispatch('common.shimmerSupport', e ? 1 : 0);
							await handleChange();
						}}
					/>
				</View>
				{/* <View activeOpacity={0.8} style={[SS.p16, S.border(2), SS.row, SS.ac, SS.jsb]}>
					<Text style={[SS.fz16]}>Support IOTA Testnet</Text>
					<Switch
						value={iotaSupport}
						onValueChange={async (e) => {
							setIotaSupport(e);
							Base.setLocalData('common.iotaSupport', e ? 1 : 0);
							dispatch('common.iotaSupport', e ? 1 : 0);
							await handleChange();
						}}
					/>
				</View> */}
				<View activeOpacity={0.8} style={[SS.p16, S.border(2), SS.row, SS.ac, SS.jsb]}>
					<Text style={[SS.fz16]}>Support Polygon Testnet</Text>
					<Switch
						value={polyganSupport}
						onValueChange={async (e) => {
							setPolyganSupport(e);
							Base.setLocalData('common.polyganSupport', e ? 1 : 0);
							dispatch('common.polyganSupport', e ? 1 : 0);
							await handleChange();
						}}
					/>
				</View>
			</Content>
		</Container>
	);
};
