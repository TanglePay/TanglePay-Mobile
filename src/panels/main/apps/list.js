import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { View, Text } from 'native-base';
import { SS, S, ThemeVar, Toast } from '@/common';
import { Base, I18n } from '@tangle-pay/common';
import Clipboard from '@react-native-clipboard/clipboard';

const Item = ({ id, icon, desc, developer, url, curAddress }) => {
	const hasTips = id === 'Simplex' && curAddress;
	return (
		<TouchableOpacity
			activeOpacity={0.8}
			onPress={() => {
				if (hasTips) {
					Clipboard.setString(curAddress);
					Toast.success(I18n.t('discover.addressCopy'));
				}
				Base.push(url, { title: id });
			}}
			style={[SS.ac, SS.row, SS.mb8]}>
			<View style={[SS.mr8]}>
				<Image style={[S.border(4), S.wh(64), { borderRadius: 16 }]} source={{ uri: Base.getIcon(icon) }} />
			</View>
			<View style={[S.w(ThemeVar.deviceWidth - 106), S.border(2), SS.pb8]}>
				<Text style={[SS.fz16, SS.fw600, SS.mb5]}>{id}</Text>
				{desc ? (
					<Text numberOfLines={2} style={[SS.fz14, SS.cS, { lineHeight: 18 }]}>
						{desc}
					</Text>
				) : null}
				{developer ? (
					<Text numberOfLines={2} style={[SS.fz14, { lineHeight: 18 }, SS.cS, SS.mt5]}>
						{developer}
					</Text>
				) : null}
			</View>
		</TouchableOpacity>
	);
};

export const List = ({ list, curWallet }) => {
	return (
		<View>
			{list.map((e) => {
				return <Item key={e.id} {...e} curAddress={curWallet?.address} />;
			})}
		</View>
	);
};
