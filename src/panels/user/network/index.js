import React from 'react';
import { Container, Content, Text } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { I18n, IotaSDK } from '@tangle-pay/common';
import { useChangeNode } from '@tangle-pay/store/common';
import { useStore } from '@tangle-pay/store';
import { S, SS, Nav } from '@/common';

export const UserNetwork = () => {
	const [curNodeId, _, dispatch] = useStore('common.curNodeId');
	const setCurNodeId = useChangeNode(dispatch);
	return (
		<Container>
			<Nav title={I18n.t('user.network')} />
			<Content>
				{IotaSDK.nodes.map((e) => {
					return (
						<TouchableOpacity
							key={e.id}
							onPress={() => {
								setCurNodeId(e.id);
							}}
							activeOpacity={0.8}
							style={[SS.p20, S.border(2)]}>
							<Text style={[SS.fz15, curNodeId === e.id && SS.cP]}>{e.name}</Text>
						</TouchableOpacity>
					);
				})}
			</Content>
		</Container>
	);
};
