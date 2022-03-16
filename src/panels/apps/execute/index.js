import React, { useRef } from 'react';
import { Container, Content, View, Text } from 'native-base';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Base } from '@tangle-pay/common';
import { useGetNodeWallet } from '@tangle-pay/store/common';
import { AssetsNav, SvgIcon, SS, S, hitSlop } from '@/common';

export const AppsExecute = () => {
	const [curWallet] = useGetNodeWallet();
	const dialogRef = useRef();
	const checkPush = (path) => {
		if (!curWallet.address) {
			Base.push('account/register');
			return;
		}
		Base.push(path);
	};
	return (
		<Container>
			<AssetsNav
				right={
					<SvgIcon
						onPress={() => {
							checkPush('assets/scan');
						}}
						name='scan'
						size={24}
						style={[SS.mr10]}
					/>
				}
			/>
			<Content>
				<View style={[SS.bgS, SS.w100, SS.p25]}>
					<View style={[SS.ac, SS.row]}>
						<Image style={[S.wh(40), SS.mr10]} source={{ uri: Base.getIcon('SMR') }} />
						<Text style={[SS.fz24]}>Soonaverse</Text>
					</View>
					<View style={[SS.pv10]}>
						<Text style={[SS.fz12, SS.cS, { lineHeight: 20 }]}>
							An all-in-one feeless platform for community engagement and DAO creation. Build, vote, earn,
							learn and let the best ideas win.
						</Text>
					</View>
					<TouchableOpacity
						activeOpacity={0.8}
						hitSlop={hitSlop}
						onPress={() => {
							Base.push('https://soonaverse.com/');
						}}>
						<Text style={[SS.fz12, { color: '#3671EE' }]}>https://soonaverse.com/</Text>
					</TouchableOpacity>
				</View>
			</Content>
		</Container>
	);
};

const styles = StyleSheet.create({});
