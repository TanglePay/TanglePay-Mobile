import React, { useEffect } from 'react';
import { Nav, S, SS, SvgIcon, Toast } from '@/common';
import { Base, I18n } from '@tangle-pay/common';
import numeral from 'numeral';
import { useStore } from '@tangle-pay/store';
import { useGetWalletInfo, useGetNodeWallet } from '@tangle-pay/store/common';
import { Container, Content, View, Text, Input, Item, Button } from 'native-base';

export const WalletDetail = () => {
	const [curWallet] = useGetNodeWallet();
	const [list, totalInfo, loading] = useGetWalletInfo();
	useEffect(() => {
		loading ? Toast.showLoading() : Toast.hideLoading();
		return () => {
			Toast.hideLoading();
		};
	}, [loading]);
	useEffect(() => {
		return () => {
			Toast.hideLoading();
		};
	}, []);
	return (
		<Container>
			{/* <AssetsNav /> */}
			<Nav title={I18n.t('account.walletDetail')} />
			<Content contentContainerStyle={[SS.ph16]}>
				<View style={[{ height: 60 }, SS.row, SS.ac, SS.jsb]}>
					<Text style={[SS.fz16]}>{I18n.t('account.seedAddresses')}</Text>
				</View>
				{list.slice(0, 3).length > 0 ? (
					<View style={[SS.pt8]}>
						<View style={[{ height: 30 }, SS.ac, SS.jsb, SS.row, SS.mb8]}>
							<Text style={[SS.flex1, SS.fz14]}>{I18n.t('account.address')}</Text>
							<Text style={[SS.flex1, SS.tr, SS.fz14]}>{I18n.t('account.outputNum')}</Text>
							<Text style={[SS.flex1, SS.tr, SS.fz14]}>{I18n.t('account.iotaNum')}</Text>
						</View>
						{list.map((e, i) => {
							return (
								<View key={i} style={[{ height: 30 }, SS.ac, SS.jsb, SS.row, SS.mb8]}>
									<Text style={[SS.flex1, SS.fz14]}>
										{(e.address || '').replace(/(^.{8})(.+)(.{4}$)/, '$1...$3')}
									</Text>
									<Text style={[SS.flex1, SS.tr, SS.fz14]}>{e.outputIds.length}</Text>
									<Text style={[SS.flex1, SS.tr, SS.fz14]}>
										{numeral(e.balanceMIOTA).format('0,0.0000')}
									</Text>
								</View>
							);
						})}
						{list.length > 3 ? (
							<View style={[{ height: 30 }, SS.c]}>
								<Text style={[SS.fz14]}>......</Text>
							</View>
						) : null}
						<View style={[{ height: 30 }, SS.ac, SS.jsb, SS.row, SS.mb8]}>
							<Text style={[SS.flex1, SS.fz14]}>{I18n.t('account.totalNum')}</Text>
							<Text style={[SS.flex1, SS.tr, SS.fz14]}>{totalInfo?.outputIds?.length || 0}</Text>
							<Text style={[SS.flex1, SS.tr, SS.fz14]}>
								{numeral(totalInfo?.balanceMIOTA || 0).format('0,0.0000')}
							</Text>
						</View>
					</View>
				) : null}
				<View style={[SS.mt24]}></View>
				{/* {totalInfo?.outputIds?.length >= 3 ? ( */}
				<Button
					onPress={() => {
						Base.push('user/WalletCollection');
					}}
					style={[SS.mb16]}
					block>
					<Text>{I18n.t('account.outputCollect')}</Text>
				</Button>
				{/* ) : null} */}
				<Text style={[SS.fz14, SS.cS, { lineHeight: 26 }]}>{I18n.t('account.collectTips')}</Text>
			</Content>
		</Container>
	);
};
