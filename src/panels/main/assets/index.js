import React, { useEffect, useState, useRef } from 'react';
import { Container, View, Text, Spinner } from 'native-base';
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
	const [unlockConditions] = useStore('common.unlockConditions');
	const [lockedList] = useStore('common.lockedList');
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
		let filterAssetsList = IotaSDK.nodes.find((e) => e.id == curWallet.nodeId)?.filterAssetsList || [
			...initAsssetsTab
		];
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
						onRefresh={async () => {
							if (curWallet.address) {
								// await Base.setLocalData(`valid.addresses.${curWallet.address}`, []);
								refreshAssets(Math.random());
							}
						}}
					/>
				}>
				<View style={[SS.ph16]}>
					<View style={[SS.pt20, S.bg(ThemeVar.brandPrimary), SS.mv8, SS.radius8, { overflow: 'hidden' }]}>
						<View style={[SS.ph16, SS.row, SS.ac]}>
							<Text style={[SS.fz14, SS.cW]}>
								{I18n.t('assets.myAssets')}({curLegal.unit || ''})
							</Text>
							<SvgIcon
								onPress={() => setShowAssets(!isShowAssets)}
								name={isShowAssets ? 'eye_1' : 'eye_0'}
								size={24}
								color='#fff'
								style={[SS.ml10]}
							/>
						</View>
						<View style={[SS.ph16, SS.mt10, SS.mb16]}>
							<Text style={[SS.cW, SS.fz24]}>{isShowAssets ? totalAssets.assets || '0.00' : '****'}</Text>
						</View>
						<View style={[SS.row, SS.pv8, S.bg('rgba(255,255,255,0.08)')]}>
							<TouchableOpacity
								onPress={() => {
									checkPush('assets/send');
								}}
								activeOpacity={0.8}
								style={[SS.flex1, SS.c, SS.pv5, S.border(1, ThemeVar.brandPrimary, 1)]}>
								<Text style={[SS.cW, SS.fz16]}>{I18n.t('assets.send')}</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => {
									checkPush('assets/receive');
								}}
								activeOpacity={0.8}
								style={[SS.flex1, SS.pv5, SS.c]}>
								<Text style={[SS.cW, SS.fz16]}>{I18n.t('assets.receive')}</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
				<View style={[SS.row, SS.ac, SS.jsb, SS.ph16, S.border(2), { width: '100%' }]}>
					<View style={[SS.row, SS.ac]}>
						<View style={[SS.flex, SS.ac, SS.row]}>
							<TouchableOpacity
								onPress={() => setTab(0)}
								activeOpacity={0.8}
								style={[SS.c, SS.mr24, { height: 60 }]}>
								<Text
									style={[
										S.color(curTab === 0 ? ThemeVar.brandPrimary : ThemeVar.textColor),
										SS.fz14
									]}>
									{I18n.t('assets.assets')}
								</Text>
							</TouchableOpacity>
						</View>
						{assetsTab.includes('soonaverse') && (
							<TouchableOpacity
								onPress={() => setTab(1)}
								activeOpacity={0.8}
								style={[SS.c, SS.mr24, { height: 60 }]}>
								<Text
									style={[
										S.color(curTab === 1 ? ThemeVar.brandPrimary : ThemeVar.textColor),
										SS.fz14
									]}>
									{I18n.t('nft.collectibles')}
								</Text>
							</TouchableOpacity>
						)}
						{unlockConditions.length > 0 || lockedList.length > 0 ? (
							<TouchableOpacity
								onPress={() => Base.push('assets/tradingList')}
								activeOpacity={0.8}
								style={[
									SS.ph5,
									SS.c,
									S.bg(unlockConditions.length == 0 ? '#3671ee' : '#D53554'),
									{ borderRadius: 4, height: 18 }
								]}>
								<Text style={[SS.cW, SS.fz14]}>
									{String(unlockConditions.length + lockedList.length)}
								</Text>
							</TouchableOpacity>
						) : null}
					</View>
					<TouchableOpacity onPress={() => setTab(2)} activeOpacity={0.8} style={[SS.c, { height: 60 }]}>
						<Text style={[S.color(curTab === 2 ? ThemeVar.brandPrimary : ThemeVar.textColor), SS.fz14]}>
							{I18n.t('assets.activity')}
						</Text>
					</TouchableOpacity>
				</View>
				<ScrollView scrollEnabled={false} ref={scroll} horizontal showsHorizontalScrollIndicator={false}>
					<View style={[S.w(ThemeVar.deviceWidth), SS.ph16, SS.jsb]}>
						<View>
							<CoinList
								setHeight={(e) => {
									let h = e + 300;
									if (h < hScroll) {
										h = hScroll;
									}
									setHeightInfo({ ...heightInfo, 0: h });
								}}
							/>
							{assetsTab.includes('stake') ? <RewardsList /> : null}
							{!isRequestAssets ? (
								<View style={[SS.p16, SS.c, SS.row]}>
									<Spinner size='small' color='gray' />
									<Text style={[SS.cS, SS.fz16, SS.pl10]}>{I18n.t('assets.requestAssets')}</Text>
								</View>
							) : null}
						</View>
						{IotaSDK.checkWeb3Node(curWallet.nodeId) ? (
							<TouchableOpacity
								style={[SS.pv16, SS.mt4, SS.c, SS.row]}
								onPress={() => {
									Base.push('assets/importToken');
								}}>
								<Text style={[SS.fz23, SS.mr12, SS.cP, { marginBottom: 3 }]}>+</Text>
								<Text style={[SS.fz15, SS.cP]} className='fz24 fw600 mr4'>
									{I18n.t('assets.importToken')}
								</Text>
							</TouchableOpacity>
						) : null}
					</View>
					<View style={[S.w(ThemeVar.deviceWidth), SS.ph16]}>
						<CollectiblesList
							setHeight={(e) => {
								setHeightInfo({ ...heightInfo, 1: e + 300 });
							}}
						/>
					</View>
					<View style={[S.w(ThemeVar.deviceWidth), SS.ph16]}>
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
