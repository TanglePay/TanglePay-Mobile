import React from 'react';
import { Container, Content, View, Text } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { Base, I18n } from '@tangle-pay/common';
import { useStore } from '@tangle-pay/store';
import { S, SS, Nav, SvgIcon, ThemeVar } from '@/common';

export const UserSetting = () => {
	useStore('common.lang');
	const list = [
		{
			icon: 'lang',
			label: I18n.t('user.language'),
			path: 'user/lang'
		},
		{
			icon: 'network',
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
									<SvgIcon name={e.icon} size={20} />
									<Text style={[SS.fz17, SS.ml10]}>{e.label}</Text>
								</View>
								<SvgIcon size={14} name='right' />
							</TouchableOpacity>
						);
					})}
				</View>
			</Content>
		</Container>
	);
};
