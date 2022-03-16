import React from 'react';
import { Container, Content, View, Text, Switch } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { Base, I18n } from '@tangle-pay/common';
import { useStore } from '@tangle-pay/store';
import { S, SS, Nav, SvgIcon } from '@/common';

export const UserSetting = () => {
	useStore('common.lang');
	const [disTrace, setDisTrace] = useStore('common.disTrace');
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
		},
		{
			icon: 'privacy',
			label: I18n.t('user.privacy'),
			tips: I18n.t('user.privacyTips'),
			type: 'switch',
			value: disTrace == 1,
			onChange: (e) => setDisTrace(e ? 1 : 0)
		}
	];
	return (
		<Container>
			<Nav title={I18n.t('user.setting')} />
			<Content>
				<View>
					{list.map((e, i) => {
						return (
							<TouchableOpacity
								activeOpacity={0.8}
								onPress={() => {
									Base.push(e.path);
								}}
								key={i}
								style={[SS.row, SS.ac, SS.jsb, SS.ph30, SS.pv20, S.border(2)]}>
								<View style={[SS.row, SS.ac]}>
									<SvgIcon name={e.icon} size={20} />
									<Text style={[SS.fz17, SS.ml10]}>{e.label}</Text>
									{e.tips && <Text style={[SS.fz11, SS.ml10, SS.cS, SS.mt5]}>{e.tips}</Text>}
								</View>
								{e.type === 'switch' ? (
									<Switch value={e.value} onValueChange={e.onChange} />
								) : (
									<SvgIcon size={14} name='right' />
								)}
							</TouchableOpacity>
						);
					})}
				</View>
			</Content>
		</Container>
	);
};
