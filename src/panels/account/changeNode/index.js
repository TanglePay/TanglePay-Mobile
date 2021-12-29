import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { Container, View, Text } from 'native-base';
import { Base, I18n, IotaSDK } from '@tangle-pay/common';
import { useChangeNode } from '@tangle-pay/store/common';
import { useStore } from '@tangle-pay/store';
import { S, SS, Nav } from '@/common';
import logo_nobg from '@tangle-pay/assets/images/logo_nobg.png';

export const AccountChangeNode = () => {
	const [, , dispatch] = useStore('common.curNodeId');
	const changeNode = useChangeNode(dispatch);
	return (
		<Container>
			<Nav leftIcon={false} headerStyle={{ borderBottomWidth: 0 }} />
			<View style={[SS.jsb, SS.column, SS.flex1, SS.pt60]}>
				<View style={[SS.ph25]}>
					<Image style={[S.wh(144, 150), SS.mb25]} source={logo_nobg} />
					<View>
						<Text style={[SS.fz30, SS.fw500, SS.mb20]}>{I18n.t('account.dearFam')}</Text>
						<Text style={[SS.fz14, S.lineHeight(22)]}>{I18n.t('account.betaReady')}</Text>
					</View>
				</View>
				<View
					style={[SS.ph15, SS.pv30, S.bg('#1F7EFC'), { borderTopLeftRadius: 24, borderTopRightRadius: 24 }]}>
					<Text style={[SS.fz14, SS.tc, SS.cW]}>{I18n.t('account.changeTips')}</Text>
					<View style={[SS.mt20, SS.mb60, S.radius(16), SS.bgW]}>
						{IotaSDK.nodes.map((e, i) => {
							return (
								<TouchableOpacity
									key={e.id}
									style={[SS.pv20, SS.c, i === 0 && S.border(2)]}
									activeOpacity={0.8}
									onPress={async () => {
										await changeNode(e.id);
										Base.push('account/login');
									}}>
									<Text style={[SS.fz15, SS.fw500]}>{e.name}</Text>
								</TouchableOpacity>
							);
						})}
					</View>
				</View>
			</View>
		</Container>
	);
};
