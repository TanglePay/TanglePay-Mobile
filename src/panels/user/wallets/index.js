import React from 'react';
import { Container, Content, View, Text } from 'native-base';
import { TouchableOpacity } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { Base, I18n, IotaSDK } from '@tangle-pay/common';
import { useGetNodeWallet } from '@tangle-pay/store/common';
import { Nav, S, SS, SvgIcon, Toast } from '@/common';

export const UserWallets = () => {
	const [_, walletsList] = useGetNodeWallet();
	return (
		<Container>
			<Nav title={I18n.t('user.manageWallets')} />
			<Content>
				<View style={[SS.ph16]}>
					{walletsList.map((e) => {
						const curNode = IotaSDK.nodes.find((d) => d.id == e.nodeId) || {};
						return (
							<TouchableOpacity
								style={[
									SS.ac,
									SS.jsb,
									SS.row,
									S.border(4, '#000', 1),
									SS.radius10,
									SS.ph16,
									SS.pv15,
									SS.mt16
								]}
								activeOpacity={0.8}
								onPress={() => {
									// setEidtWallet(e.id),
									Base.push('user/editWallet', { id: e.id });
								}}
								key={e.id}>
								<View style={[SS.flex1]}>
									<View style={[SS.row, SS.ac, SS.jsb, SS.mr16]}>
										<Text style={[SS.fz16, SS.fw600]}>{e.name}</Text>
										<Text style={[SS.fz14]}>{curNode?.type == 2 ? 'EVM' : curNode?.name}</Text>
									</View>
									<View style={[SS.mt5, SS.row, SS.ae]}>
										<Text style={[SS.fz14, { minWidth: 85 }]}>{Base.handleAddress(e.address)}</Text>
										<SvgIcon
											onPress={() => {
												Clipboard.setString(e.address);
												Toast.success(I18n.t('assets.copied'));
											}}
											name='copy'
											size={16}
										/>
									</View>
								</View>
								<SvgIcon size={16} name='right' />
							</TouchableOpacity>
						);
					})}
				</View>
			</Content>
		</Container>
	);
};
