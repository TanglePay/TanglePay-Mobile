import React, { useState } from 'react';
import { Container, Content, View, Text } from 'native-base';
import { StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import { Base, Nav1, S, SS, I18n, images, Icon } from '@/common';

const list = [
	{
		id: 1,
		coin: 'USDT',
		icon: 'https://picsum.photos/id/766/200/200',
		type: 1
	},
	{
		id: 2,
		coin: 'IOTA',
		icon: 'https://picsum.photos/id/766/200/200',
		type: 2
	}
];

export const AssetsAddAssets = () => {
	const [search, setSearch] = useState('');
	return (
		<Container>
			<Nav1 title={I18n.t('assets.addAssets')} />
			<Content>
				<View
					style={[
						S.border(4, '#ccc', 1),
						S.radius(6),
						SS.row,
						SS.ac,
						SS.ph10,
						SS.mh30,
						SS.mT20,
						SS.mb30,
						S.paddingV(2)
					]}>
					<Image style={[S.wh(15), SS.mr10]} source={images.com.search} />
					<TextInput
						value={search}
						onChangeText={setSearch}
						style={[SS.fz14, SS.cS, S.h(40)]}
						placeholder={I18n.t('assets.addAssetsTips')}
					/>
				</View>
				<View style={[SS.ph30]}>
					{list.map((e) => {
						return (
							<View key={e.id} style={[SS.row, SS.as, SS.mb15]}>
								<Image style={[S.wh(35), SS.mr25, S.radius(35)]} source={{ uri: e.icon }} />
								<View style={[SS.jsb, SS.row, SS.ac, SS.pb15, S.border(2, '#ccc', 1), SS.flex1]}>
									<Text style={[SS.fz17]}>{e.coin}</Text>
									<Icon
										onPress={() => {}}
										style={[S.wh(24)]}
										name={e.type === 1 ? images.com.add_1 : images.com.reduce}
									/>
								</View>
							</View>
						);
					})}
				</View>
			</Content>
		</Container>
	);
};

const styles = StyleSheet.create({});
