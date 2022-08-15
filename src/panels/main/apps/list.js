import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { View, Text } from 'native-base';
import { SS, S, ThemeVar } from '@/common';
import { Base } from '@tangle-pay/common';

const Item = ({ id, icon, desc, developer, url }) => {
	return (
		<TouchableOpacity
			activeOpacity={0.8}
			onPress={() => {
				Base.push(url, { title: id });
			}}
			style={[SS.ac, SS.row, SS.mb8]}>
			<View style={[SS.c, SS.p10, SS.radius10, S.border(4), SS.mr8]}>
				<Image style={[S.wh(44)]} source={{ uri: Base.getIcon(icon) }} />
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

export const List = ({ list }) => {
	return (
		<View>
			{list.map((e) => {
				return <Item key={e.id} {...e} />;
			})}
		</View>
	);
};
