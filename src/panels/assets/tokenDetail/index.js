import React, { useState, useRef } from 'react';
import { S, SS, Nav, Toast } from '@/common';
import { I18n } from '@tangle-pay/common';
import { TouchableOpacity, Image } from 'react-native';
import { Container, View, Text, Content } from 'native-base';
import * as Yup from 'yup';
import { useGetNodeWallet } from '@tangle-pay/store/common';
import { useRoute } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';

export const TokenDetail = () => {
	const { params } = useRoute();
	let { tokenId, name, standard, logoUrl } = params;
	name = (name || '').toLocaleUpperCase();
	const [opacity, setOpacity] = useState(1);
	return (
		<Container>
			<Nav title={I18n.t('assets.tokenDetail')} />
			<Content>
				<View style={[SS.flex, SS.c, SS, { marginTop: 80, marginBottom: 60 }]}>
					<View style={[SS.c, SS.pr]}>
						<Image
							style={[
								S.wh(64),
								S.radius(64),
								SS.pa,
								SS.bgW,
								{ left: 0, top: 0, zIndex: 1, opacity },
								S.border(4),
								SS.mb8
							]}
							source={{ uri: logoUrl }}
							onError={() => {
								setOpacity(0);
							}}
						/>
						<View style={[{ width: 64, height: 64, borderRadius: 64 }, S.border(4), SS.bgP, SS.c]}>
							<Text style={[SS.fw600, SS.cW, { fontSize: 30, lineHeight: 64 }]}>
								{String(name).toLocaleUpperCase()[0]}
							</Text>
						</View>
					</View>
					<Text style={[SS.fz16, SS.mt12, SS.fw600]}>{name}</Text>
				</View>
				<View style={[SS.ph16]}>
					{standard ? (
						<View style={[SS.mb16, SS.bgS, SS.radius10, SS.ac, SS.row, SS.jsb, SS.ph16, { height: 48 }]}>
							<Text style={[SS.fz16, SS.fw600]}>{I18n.t('assets.standard')}</Text>
							<Text style={[SS.fz16, SS.fw600]}>{standard}</Text>
						</View>
					) : null}
					{name ? (
						<View style={[SS.mb16, SS.bgS, SS.radius10, SS.ac, SS.row, SS.jsb, SS.ph16, { height: 48 }]}>
							<Text style={[SS.fz16, SS.fw600]}>{I18n.t('assets.tokenName')}</Text>
							<Text style={[SS.fz16, SS.fw600]}>{name}</Text>
						</View>
					) : null}
					<View style={[SS.mb16, SS.bgS, SS.radius10, SS.ph16, SS.pv15]}>
						<Text style={[SS.fz16, SS.fw600, SS.mb4]}>{I18n.t('assets.tokenID')}</Text>
						<TouchableOpacity
							activeOpacity={0.8}
							onPress={() => {
								Clipboard.setString(tokenId);
								Toast.success(I18n.t('assets.copied'));
							}}>
							<Text style={[SS.fz16, SS.fw400]}>{tokenId}</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Content>
		</Container>
	);
};
