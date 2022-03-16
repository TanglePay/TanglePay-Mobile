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
			style={[SS.ac, SS.row, SS.mb20]}>
			<View style={[SS.c, SS.p10, SS.radius10, S.border(4), SS.mr10]}>
				<Image style={[S.wh(60)]} source={{ uri: Base.getIcon(icon) }} />
			</View>
			<View style={[{ ...S.w(ThemeVar.deviceWidth - 130) }]}>
				<Text style={[SS.fz18, SS.mb5]}>{id}</Text>
				<Text style={[SS.fz12]}>{desc}</Text>
				<Text style={[SS.fz12, SS.cS, SS.mt5]}>{developer}</Text>
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
