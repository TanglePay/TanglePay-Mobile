import React, { useEffect, useState, useRef } from 'react';
import { Container, View, Text } from 'native-base';
import { TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import { Base, I18n, IotaSDK } from '@tangle-pay/common';
import { useStore } from '@tangle-pay/store';
import { CoinList, ActivityList, CollectiblesList, RewardsList } from './list';
import { useGetNodeWallet, useGetAssetsList, useGetLegal, useChangeNode } from '@tangle-pay/store/common';
import { AssetsNav, SvgIcon, S, SS, ThemeVar, Toast } from '@/common';
import { useGetEventsConfig } from '@tangle-pay/store/staking';

const hScroll = ThemeVar.deviceHeight - 200;
const initAsssetsTab = ['stake', 'soonaverse', 'contract'];
export const Assets = () => {
	useGetEventsConfig();
	const [assetsTab, setAssetsTab] = useState([]);
	const [heightInfo, setHeightInfo] = useState({ 0: hScroll, 1: undefined, 2: undefined });
	const [isRequestAssets, _] = useStore('common.isRequestAssets');
	const [isRequestHis, __] = useStore('common.isRequestHis');
	const changeNode = useChangeNode();
	const [isShowAssets, setShowAssets] = useStore('common.showAssets');
	const [___, refreshAssets] = useStore('common.forceRequest');
	const [curWallet] = useGetNodeWallet();
	const [search, setSearch] = useState('');
	const [curTab, setTab] = useState(0);
	const scroll = useRef();
	const scrollPage = useRef();
	useGetAssetsList(curWallet);
	const [totalAssets] = useStore('common.totalAssets');
	const curLegal = useGetLegal();
	const checkPush = (path) => {
		if (!curWallet.address) {
			Base.push('account/register');
			return;
		}
		if (!IotaSDK.client) {
			Toast.error(I18n.t('user.nodeError'));
			return;
		}
		Base.push(path);
	};
	useEffect(() => {
		switch (curTab) {
			case 0:
				scrollPage.current.scrollTo({
					y: 0,
					animated: true
				});
				scroll.current.scrollTo({
					x: 0,
					animated: true
				});
				break;
			case 1:
				scrollPage.current.scrollTo({
					y: 0,
					animated: true
				});
				scroll.current.scrollTo({
					x: ThemeVar.deviceWidth,
					animated: true
				});
				break;
			case 2:
				scroll.current.scrollToEnd();
				break;
			default:
				break;
		}
	}, [curTab]);
	useEffect(() => {
		const filterAssetsList = IotaSDK.nodes.find((e) => e.id === curWallet.nodeId)?.filterAssetsList || [];
		setAssetsTab([...initAsssetsTab.filter((e) => !filterAssetsList.includes(e))]);
	}, [curWallet.nodeId]);
	return (
		<Container>
			<AssetsNav hasChangeNode hasViewExplorer hasScan />
			<ScrollView
				ref={scrollPage}
				// style={{ height: curTab === 0 ? 600 : undefined }}
				// scrollEnabled={curTab === 1}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={[{ height: heightInfo[curTab] || hScroll }]}
				refreshControl={
					<RefreshControl
						refreshing={false}
						onRefresh={() => {
							if (isRequestAssets && isRequestHis) {
								refreshAssets(Math.random());
							}
						}}
					/>
				}>
				<View style={[SS.ph20]}>
					<View style={[SS.pt20, S.bg('#1D70F7'), SS.mt5, SS.radius10, { overflow: 'hidden' }]}>
						<View style={[SS.ph20, SS.row, SS.ac]}>
							<Text style={[SS.fz16, SS.cW]}>
								{I18n.t('assets.myAssets')}({curLegal.unit || ''})
							</Text>
							<SvgIcon
								onPress={() => setShowAssets(!isShowAssets)}
								name={isShowAssets ? 'eye_1' : 'eye_0'}
								size={24}
								color='#fff'
								style={[SS.ml5]}
							/>
						</View>
						<View style={[SS.ph20, SS.mt20, SS.mb15]}>
							<Text style={[SS.cW, SS.fz20]}>{isShowAssets ? totalAssets.assets || '0.00' : '****'}</Text>
						</View>
						<View style={[SS.row, SS.pv10, S.bg('#1F7EFC')]}>
							<TouchableOpacity
								onPress={() => {
									checkPush('assets/send');
								}}
								activeOpacity={0.8}
								style={[SS.flex1, SS.c, SS.pv5, S.border(1, '#fff', 1)]}>
								<Text style={[SS.cW, SS.fz17]}>{I18n.t('assets.send')}</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => {
									checkPush('assets/receive');
								}}
								activeOpacity={0.8}
								style={[SS.flex1, SS.pv5, SS.c]}>
								<Text style={[SS.cW, SS.fz17]}>{I18n.t('assets.receive')}</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
				<View style={[SS.row, SS.jsb, SS.ac, SS.mt25, SS.mb10]}>
					<View style={[SS.ph20, SS.row, SS.ac, SS.jsb, S.border(2), { width: '100%' }]}>
						<View style={[SS.row, SS.ac]}>
							<TouchableOpacity
								onPress={() => setTab(0)}
								activeOpacity={0.8}
								style={[SS.c, SS.pv20, SS.mr30]}>
								<Text
									style={[
										S.color(curTab === 0 ? ThemeVar.brandPrimary : ThemeVar.textColor),
										SS.fz17
									]}>
									{I18n.t('assets.assets')}
								</Text>
							</TouchableOpacity>
							{assetsTab.includes('soonaverse') && (
								<TouchableOpacity onPress={() => setTab(1)} activeOpacity={0.8} style={[SS.c, SS.pv20]}>
									<Text
										style={[
											S.color(curTab === 1 ? ThemeVar.brandPrimary : ThemeVar.textColor),
											SS.fz17
										]}>
										{I18n.t('nft.collectibles')}
									</Text>
								</TouchableOpacity>
							)}
						</View>
						<TouchableOpacity onPress={() => setTab(2)} activeOpacity={0.8} style={[SS.c, SS.pv20]}>
							<Text style={[S.color(curTab === 2 ? ThemeVar.brandPrimary : ThemeVar.textColor), SS.fz17]}>
								{I18n.t('assets.activity')}
							</Text>
						</TouchableOpacity>
					</View>
					{
						// curTab === 0 ? null : null
						// <Icon
						// 	onPress={() => {
						// 		Base.push('assets/addAssets');
						// 	}}
						// 	style={[S.wh(20)]}
						// 	name={images.com.add}
						// />
						// <View style={[S.border(4, '#ccc', 1), S.radius(6), SS.row, SS.ac, SS.ph10, S.paddingV(2)]}>
						// 	<Image style={[S.wh(12), SS.mr10]} source={images.com.search} />
						// 	<TextInput
						// 		value={search}
						// 		onChangeText={setSearch}
						// 		style={[SS.fz14, SS.cS, S.w(50), SS.p0]}
						// 		placeholder={I18n.t('assets.search')}
						// 	/>
						// </View>
					}
				</View>
				<ScrollView scrollEnabled={false} ref={scroll} horizontal showsHorizontalScrollIndicator={false}>
					<View style={[S.w(ThemeVar.deviceWidth), SS.ph20]}>
						<CoinList />
						{assetsTab.includes('stake') && <RewardsList />}
					</View>
					<View style={[S.w(ThemeVar.deviceWidth), SS.ph20]}>
						<CollectiblesList
							setHeight={(e) => {
								setHeightInfo({ ...heightInfo, 1: e + 300 });
							}}
						/>
					</View>
					<View style={[S.w(ThemeVar.deviceWidth), SS.ph20]}>
						<ActivityList
							search={search}
							setHeight={(e) => {
								setHeightInfo({ ...heightInfo, 2: e + 300 });
							}}
						/>
					</View>
				</ScrollView>
			</ScrollView>
		</Container>
	);
};
