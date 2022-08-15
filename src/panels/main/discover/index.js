import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Base, I18n, API_URL } from '@tangle-pay/common';
import { useGetNodeWallet } from '@tangle-pay/store/common';
import { SvgIcon } from '@/common/assets';
import { Toast, Nav, SS, S, ThemeVar } from '@/common';
import { Container, View, Text } from 'native-base';
import Clipboard from '@react-native-clipboard/clipboard';

export const Discover = () => {
	const [curWallet] = useGetNodeWallet();
	const [switchConfig, setSwichConfig] = useState({});
	useEffect(() => {
		fetch(`${API_URL}/switchConfig.json?v=${new Date().getTime()}`)
			.then((res) => res.json())
			.then((res) => {
				setSwichConfig(res);
			});
	}, []);
	return (
		<Container>
			<Nav leftIcon={false} title={I18n.t('discover.title')}></Nav>
			<>
				<TouchableOpacity
					onPress={() => {
						Base.push('stake/index');
					}}
					activeOpacity={0.8}
					style={[SS.bgW, SS.ac, SS.row, SS.jsb, SS.ph16, { height: 60 }, S.border(2)]}>
					<View style={[SS.row, SS.ac]}>
						<SvgIcon style={[SS.mr16]} name='stake' color={ThemeVar.brandPrimary} size='22' />
						<Text style={[SS.fz16]}>{I18n.t('staking.title')}</Text>
					</View>
					<SvgIcon name='right' color='#000' size='16' />
				</TouchableOpacity>
				{switchConfig.buyIota == 1 ? (
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => {
							const url = 'https://tanglepay.com/simplex.html?crypto=MIOTA';
							// const url = 'https://tanglepay.com/simplex-staging.html?crypto=MIOTA';
							if (curWallet.address) {
								Clipboard.setString(curWallet.address);
								Toast.success(I18n.t('discover.addressCopy'));
								setTimeout(() => {
									Base.push(url);
								}, 2000);
							} else {
								Base.push(url);
							}
						}}>
						<View style={[SS.bgW, SS.ac, SS.row, SS.jsb, SS.ph16, { height: 60 }, S.border(2)]}>
							<View style={[SS.row, SS.ac]}>
								<SvgIcon
									style={[SS.mr16, { marginBottom: -2 }]}
									name='buy'
									color={ThemeVar.brandPrimary}
									size='20'
								/>
								<Text style={[SS.fz16]}>{I18n.t('discover.buyIota')}</Text>
							</View>
							<SvgIcon name='right' color='#000' size='16' />
						</View>
					</TouchableOpacity>
				) : null}
			</>
		</Container>
	);
};
