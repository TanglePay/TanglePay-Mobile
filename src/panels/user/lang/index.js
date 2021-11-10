import React from 'react';
import { Container, Content, View, Text } from 'native-base';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Base, Nav, I18n, SS, S } from '@/common';
import { useStore } from '@/store';

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
					style={[SS.p20, S.border(2)]}>
					<Text style={[SS.fz15, lang === 'en' && SS.cP]}>English</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {
						setLang('zh');
					}}
					activeOpacity={0.8}
					style={[SS.p20, S.border(2)]}>
					<Text style={[SS.fz15, lang === 'zh' && SS.cP]}>简体中文</Text>
				</TouchableOpacity>
			</Content>
		</Container>
	);
};

const styles = StyleSheet.create({});
