import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '@tangle-pay/store';
import { Image, Animated, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useHandleUnlocalConditions, useGetNodeWallet } from '@tangle-pay/store/common';
import { Container, Content, View, Text, Button } from 'native-base';
import { Base, I18n } from '@tangle-pay/common';
import { S, SS, Nav, SvgIcon, NoData, ThemeVar } from '@/common';

const Item = (item) => {
	const [ipfsImage, setIpfsImage] = useState('');
	const { onDismiss, onDismissNft } = useHandleUnlocalConditions();
	const [opacity, setOpacity] = useState(1);
	const btnAnim = useRef(new Animated.Value(0)).current;
	const [isShowBtn, setShowBtn] = useState(false);
	const showBtn = () => {
		Animated.timing(btnAnim, {
			toValue: -200,
			duration: 300
		}).start();
		setShowBtn(true);
	};

	const hideBtn = () => {
		Animated.timing(btnAnim, {
			toValue: 0,
			duration: 300
		}).start();
		setShowBtn(false);
	};

	useEffect(() => {
		if (/^ipfs/.test(item.logoUrl)) {
			fetch(item.logoUrl)
				.then((res) => res.json())
				.then((res) => {
					setIpfsImage(res?.image || '');
				});
		}
	}, [item.logoUrl]);

	return (
		<View style={[S.border(2)]}>
			<View style={[{ height: 72 }, SS.w100, SS.ac, SS.row]}>
				<View style={[SS.c, SS.pr, { height: 72, width: 80 }]}>
					<Image
						style={[
							S.wh(32),
							S.radius(32),
							SS.pa,
							SS.bgW,
							{ left: 24, top: 20, zIndex: 1, opacity },
							S.border(4)
						]}
						source={{ uri: ipfsImage || item.logoUrl }}
						onError={() => {
							setOpacity(0);
						}}
					/>
					<View style={[{ width: 32, height: 32, borderRadius: 32 }, S.border(4), SS.bgP, SS.c]}>
						<Text style={[SS.fw600, SS.cW, SS.fz22]}>
							{String(item.token || item.name).toLocaleUpperCase()[0]}
						</Text>
					</View>
				</View>
				<View style={[{ height: 72 }, SS.row, SS.ac, SS.jsb, SS.mr24, SS.flex1, S.border(2)]}>
					<View style={{ width: 100 }}>
						<Text style={[SS.cP, SS.fz14, SS.fw600]}>
							{item.nftId ? item.name : `${item.token}: ${item.amountStr}`}
						</Text>
					</View>
					<View style={{ width: 130 }}>
						<View>
							<Text numberOfLines={1} style={[SS.fz14, SS.fw400, SS.mb4, { width: 130 }]}>
								{item.id}
							</Text>
						</View>
						<View>
							<Text numberOfLines={1} style={[SS.fz14, SS.fw400, { width: 130 }]}>
								{I18n.t('assets.tradingFrom')} {Base.handleAddress(item.unlockAddress)}
							</Text>
						</View>
					</View>
				</View>
			</View>
			<Animated.View
				style={[
					{ width: ThemeVar.deviceWidth + 200 },
					SS.row,
					SS.ac,
					{ transform: [{ translateX: btnAnim }] }
				]}>
				<TouchableOpacity
					onPress={hideBtn}
					activeOpacity={1}
					style={[{ width: ThemeVar.deviceWidth }, SS.ac, SS.row, SS.jsb, SS.pr24, { height: 60 }]}>
					<View style={[SS.ac, SS.row]}>
						<View style={[SS.c, { width: 80 }]}>
							<SvgIcon size='24' style={{ width: 24, height: 24 }} name='tradingTime' />
						</View>
						<Text style={[SS.fz14, SS.fw400]}>{item.timeStr}</Text>
					</View>
					{!isShowBtn ? (
						<SvgIcon
							onPress={() => {
								// Base.push('assets/trading', {
								// 	id: item.blockId
								// });
								// console.log(swipe.current);
								showBtn();
							}}
							style={[{ width: 24, height: 24 }, SS.cP]}
							size='24'
							name='add'
						/>
					) : null}
				</TouchableOpacity>
				<View style={[SS.row, SS.ac]}>
					<Button
						light
						full
						activeOpacity={1}
						style={[{ height: 60, width: 100 }]}
						onPress={() => {
							Alert.alert('', I18n.t('assets.dismissTips'), [
								{
									text: I18n.t('apps.cancel'),
									style: 'cancel'
								},
								{
									text: I18n.t('apps.execute'),
									onPress: () => {
										if (item.nftId) {
											onDismissNft(item.id);
										} else {
											onDismiss(item.id);
										}
									},
									style: 'default'
								}
							]);
						}}>
						<Text>{I18n.t('shimmer.dismiss')}</Text>
					</Button>
					<Button
						style={[{ height: 60, width: 100 }]}
						full
						color='primary'
						activeOpacity={1}
						onPress={() => {
							Base.push('assets/trading', {
								id: item.id,
								isLedger: item.isLedger ? 1 : 0
							});
							hideBtn();
						}}>
						<Text>{I18n.t('shimmer.accept')}</Text>
					</Button>
				</View>
			</Animated.View>
		</View>
	);
};

const LockedItem = (item) => {
	const [ipfsImage, setIpfsImage] = useState('');
	const [opacity, setOpacity] = useState(1);
	useEffect(() => {
		if (/^ipfs/.test(item.logoUrl)) {
			fetch(item.logoUrl)
				.then((res) => res.json())
				.then((res) => {
					setIpfsImage(res?.image || '');
				});
		}
	}, [item.logoUrl]);
	return (
		<View style={[S.border(2)]}>
			<View style={[{ height: 72 }, SS.w100, SS.ac, SS.row]}>
				<View style={[SS.c, SS.pr, { height: 72, width: 80 }]}>
					<Image
						style={[
							S.wh(32),
							S.radius(32),
							SS.pa,
							SS.bgW,
							{ left: 24, top: 20, zIndex: 1, opacity },
							S.border(4)
						]}
						source={{ uri: ipfsImage || item.logoUrl }}
						onError={() => {
							setOpacity(0);
						}}
					/>
					<View style={[{ width: 32, height: 32, borderRadius: 32 }, S.border(4), SS.bgP, SS.c]}>
						<Text style={[SS.fw600, SS.cW, SS.fz22]}>
							{String(item.token || item.name).toLocaleUpperCase()[0]}
						</Text>
					</View>
				</View>
				<View style={[{ height: 72 }, SS.row, SS.ac, SS.jsb, SS.mr24, SS.flex1, S.border(2)]}>
					<View style={{ width: 100 }}>
						<Text style={[SS.cP, SS.fz14, SS.fw600]}>
							{item.nftId ? item.name : `${item.token}: ${item.amountStr}`}
						</Text>
					</View>
					<View style={{ width: 130 }}>
						<View>
							<Text numberOfLines={1} style={[SS.fz14, SS.fw400, SS.mb4, { width: 130 }]}>
								{item.blockId}
							</Text>
						</View>
						<View>
							<Text numberOfLines={1} style={[SS.fz14, SS.fw400, { width: 130 }]}>
								{I18n.t('assets.tradingFrom')} {Base.handleAddress(item.unlockAddress)}
							</Text>
						</View>
					</View>
				</View>
			</View>
			<View style={[SS.row, SS.ac, SS.jsb]}>
				<View style={[SS.ac, SS.row, SS.jsb, SS.pr24, { height: 60 }]}>
					<View style={[SS.ac, SS.row]}>
						<View style={[SS.c, { width: 80 }]}>
							<SvgIcon size='24' style={{ width: 24, height: 24 }} name='tradingTime' />
						</View>
						<Text style={[SS.fz14, SS.fw400]}>{item.timeStr}</Text>
					</View>
				</View>
				<View style={[SS.bgS, SS.mr24, { borderRadius: 4, paddingHorizontal: 10, paddingVertical: 4 }]}>
					<Text style={[SS.fz12]}> {I18n.t('assets.locked')}</Text>
				</View>
			</View>
		</View>
	);
};

export const AssetsTradingList = () => {
	const [unlockConditions] = useStore('common.unlockConditions');
	const [lockedList] = useStore('common.lockedList');
	const [nftUnlockList] = useStore('nft.unlockList');
	const [nftLockList] = useStore('nft.lockList');
	const [curWallet] = useGetNodeWallet();
	const isLedger = curWallet.type == 'ledger';
	return (
		<Container>
			<Nav title={I18n.t('assets.tradingList')} />
			<ScrollView>
				<View style={[S.h(10)]} />
				{unlockConditions.length > 0 ||
				lockedList.length > 0 ||
				nftUnlockList.length > 0 ||
				nftLockList.length > 0 ? (
					<>
						<View>
							{unlockConditions.map((e, i) => {
								return <Item {...e} key={e.blockId} id={e.blockId} isLedger={isLedger} />;
							})}
						</View>
						<View>
							{nftUnlockList.map((e, i) => {
								return (
									<Item
										{...e}
										key={e.nftId}
										id={e.nftId}
										logoUrl={e.thumbnailImage || e.media}
										isLedger={isLedger}
									/>
								);
							})}
						</View>
						<View>
							{lockedList.map((e, i) => {
								return <LockedItem {...e} key={e.blockId} />;
							})}
						</View>
						<View>
							{nftLockList.map((e, i) => {
								return <LockedItem {...e} key={e.nftId} logoUrl={e.thumbnailImage || e.media} />;
							})}
						</View>
					</>
				) : (
					<NoData />
				)}
				<View style={[S.h(30)]} />
			</ScrollView>
		</Container>
	);
};
