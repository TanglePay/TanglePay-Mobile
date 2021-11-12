import React from 'react';
import { Container, Content, View, Text } from 'native-base';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Base, Nav, S, SS, images, I18n } from '@tangle-pay/common';
import { useStore } from '@tangle-pay/store';

export const UserSetting = () => {
	useStore('common.lang');
	const list = [
		{
			icon: images.com.lang,
			label: I18n.t('user.language'),
			path: 'user/lang'
		},
		{
			icon: images.com.network,
			label: I18n.t('user.network'),
			path: 'user/network'
		}
	];
	return (
		<Container>
			<Nav title={I18n.t('user.setting')} />
			<Content>
				<View>
					{list.map((e) => {
						return (
							<TouchableOpacity
								activeOpacity={0.8}
								onPress={() => {
									Base.push(e.path);
								}}
								key={e.path}
								style={[SS.row, SS.ac, SS.jsb, SS.ph30, SS.pv20, S.border(2)]}>
								<View style={[SS.row, SS.ac]}>
									<Image resizeMode='contain' style={[S.wh(20)]} source={e.icon} />
									<Text style={[SS.fz17, SS.ml10]}>{e.label}</Text>
								</View>
								<View>
									<Image style={[S.wh(16)]} source={images.com.right} />
								</View>
							</TouchableOpacity>
						);
					})}
				</View>
			</Content>
		</Container>
	);
};

const styles = StyleSheet.create({});
