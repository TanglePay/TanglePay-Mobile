import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Base, I18n, API_URL } from '@tangle-pay/common';
import { useGetNodeWallet } from '@tangle-pay/store/common';
import { SvgIcon } from '@/common/assets';
import { Toast, Nav, SS } from '@/common';
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
		<Container style={{ backgroundColor: '#F2F2F2' }}>
			<Nav leftIcon={false} title={I18n.t('discover.title')}></Nav>
			<>
				<TouchableOpacity
					onPress={() => {
						Base.push('stake/index');
					}}
					activeOpacity={0.8}
					style={[SS.bgW, SS.ac, SS.row, SS.jsb, SS.ph15, SS.pv20, SS.mt15]}>
					<View style={[SS.row, SS.ac]}>
						<SvgIcon style={[SS.mr15]} name='stake' color='#FCB11D' size='18' />
						<Text style={[SS.fz16, SS.fw500]}>{I18n.t('staking.title')}</Text>
					</View>
					<SvgIcon name='right' color='#CCCCCC' size='13' />
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
						<View style={[SS.bgW, SS.ac, SS.row, SS.jsb, SS.ph15, SS.pv20, SS.mt15]}>
							<View style={[SS.row, SS.ac]}>
								<SvgIcon style={[SS.mr15, { marginBottom: -2 }]} name='buy' color='#4E9B45' size='18' />
								<Text style={[SS.fz16, SS.fw500]}>{I18n.t('discover.buyIota')}</Text>
							</View>
							<SvgIcon name='right' color='#CCCCCC' size='13' />
						</View>
					</TouchableOpacity>
				) : null}
			</>
		</Container>
	);
};
