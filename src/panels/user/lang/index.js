import React from 'react';
import { Container, Content, View, Text } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { I18n } from '@tangle-pay/common';
import { useStore } from '@tangle-pay/store';
import { S, SS, Nav } from '@/common';

export const UserLang = () => {
	const [lang, setLang] = useStore('common.lang');
	return (
		<Container>
			<Nav title={I18n.t('user.language')} />
			<Content>
				<TouchableOpacity
					onPress={() => {
						setLang('en');
					}}
					activeOpacity={0.8}
					style={[SS.p16, S.border(2)]}>
					<Text style={[SS.fz15, lang === 'en' && SS.cP]}>English</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {
						setLang('zh');
					}}
					activeOpacity={0.8}
					style={[SS.p16, S.border(2)]}>
					<Text style={[SS.fz15, lang === 'zh' && SS.cP]}>繁體中文</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {
						setLang('de');
					}}
					activeOpacity={0.8}
					style={[SS.p16, S.border(2)]}>
					<Text style={[SS.fz15, lang === 'de' && SS.cP]}>Deutsch</Text>
				</TouchableOpacity>
			</Content>
		</Container>
	);
};
