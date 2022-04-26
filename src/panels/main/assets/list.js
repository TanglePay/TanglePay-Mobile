import React, { useEffect, useState, useMemo } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { View, Text, Spinner } from 'native-base';
import { I18n, Base } from '@tangle-pay/common';
import { useStore } from '@tangle-pay/store';
import { useGetLegal } from '@tangle-pay/store/common';
import dayjs from 'dayjs';
import { S, SS, SvgIcon, Theme, ThemeVar } from '@/common';
import { useGetNodeWallet } from '@tangle-pay/store/common';
import _get from 'lodash/get';
import { useGetNftList } from '@tangle-pay/store/nft';
import ImageView from 'react-native-image-view';
import { CachedImage } from 'react-native-img-cache';
import { ImageCache } from 'react-native-img-cache';

const itemH = 80;
export const CoinList = () => {
	const [isShowAssets] = useStore('common.showAssets');
	const [needRestake] = useStore('staking.needRestake');
	const [assetsList] = useStore('common.assetsList');
	const [statedAmount] = useStore('staking.statedAmount');
	const curLegal = useGetLegal();
	return (
		<View>
			{assetsList.map((e) => {
				return (
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => {
							Base.push('assets/send');
						}}
						key={e.name}
						style={[SS.row, SS.ac, { height: itemH }]}>
						<Image
							style={[S.wh(45), S.radius(45), SS.mr25, S.border(4)]}
							source={{ uri: Base.getIcon(e.name) }}
						/>
						<View style={[S.border(2, '#ccc'), SS.flex1, SS.row, SS.ac, SS.jsb, { height: itemH }]}>
							<View style={[SS.ac, SS.row]}>
								<Text style={[SS.fz17]}>{e.name}</Text>
								{statedAmount > 0 && !needRestake && (
									<View
										style={[
											SS.ml20,
											S.border(4, '#BABABA'),
											S.radius(4),
											{ paddingHorizontal: 4, paddingVertical: 0 }
										]}>
										<Text style={[SS.fz10, SS.cS]}> {I18n.t('staking.title')}</Text>
									</View>
								)}
							</View>
							{isShowAssets ? (
								<View>
									<Text style={[SS.fz15, SS.tr, SS.mb5]}>
										{e.balance} {e.unit}
									</Text>
									<Text style={[SS.fz15, SS.tr, SS.cS]}>
										{curLegal.unit} {e.assets}
									</Text>
								</View>
							) : (
								<View>
									<Text style={[SS.fz15, SS.tr, SS.mb5]}>****</Text>
									<Text style={[SS.fz15, SS.tr, SS.cS]}>****</Text>
								</View>
							)}
						</View>
					</TouchableOpacity>
				);
			})}
		</View>
	);
};
export const RewardsList = () => {
	const [isShowAssets] = useStore('common.showAssets');
	const [stakedRewards] = useStore('staking.stakedRewards');
	const [list, setList] = useState([]);
	const [curWallet] = useGetNodeWallet();
	const [{ rewards }] = useStore('staking.config');
	const [isRequestAssets] = useStore('common.isRequestAssets');
	useEffect(() => {
		const obj = {};
		for (const i in stakedRewards) {
			const item = stakedRewards[i];
			if (item.address !== curWallet?.address) {
				return;
			}
			if (item.amount > 0) {
				const symbol = item.symbol;
				obj[symbol] = obj[symbol] || {
					...item,
					amount: 0
				};
				obj[symbol].amount += item.amount;
				const ratio = _get(rewards, `${symbol}.ratio`) || 0;
				let unit = _get(rewards, `${symbol}.unit`) || symbol;
				let total = obj[symbol].amount * ratio || 0;
				// // 1 = 1000m = 1000000u
				let preUnit = '';
				if (total > 0) {
					if (total <= Math.pow(10, -5)) {
						total = Math.pow(10, 6) * total;
						preUnit = 'μ';
					} else if (total <= Math.pow(10, -2)) {
						total = Math.pow(10, 3) * total;
						preUnit = 'm';
					} else if (total >= Math.pow(10, 4)) {
						total = Math.pow(10, -3) * total;
						preUnit = 'k';
					}
				}
				obj[symbol].amountLabel = `${Base.formatNum(total)}${preUnit} ${unit}`;
				obj[symbol].unit = unit;
			}
		}
		setList(Object.values(obj));
	}, [JSON.stringify(stakedRewards), JSON.stringify(rewards), curWallet?.address]);
	const ListEl = useMemo(() => {
		return list.map((e) => {
			return (
				<View key={e.symbol} style={[SS.row, SS.ac, { opacity: 0.6, height: itemH }]}>
					<Image
						style={[S.wh(45), S.radius(45), SS.mr25, S.border(4)]}
						source={{ uri: Base.getIcon(e.symbol) }}
					/>
					<View style={[S.border(2, '#ccc'), SS.flex1, SS.row, SS.ac, SS.jsb, { height: itemH }]}>
						<Text style={[SS.fz17]}>{e.unit}</Text>
						{isShowAssets ? (
							<View>
								<Text style={[SS.fz15, SS.tr]}>{e.amountLabel}</Text>
							</View>
						) : (
							<View>
								<Text style={[SS.fz15, SS.tr]}>****</Text>
							</View>
						)}
					</View>
				</View>
			);
		});
	}, [JSON.stringify(list), isShowAssets]);
	return (
		<>
			{list.length <= 0 ? null : ListEl}
			{!isRequestAssets && (
				<View style={[SS.p30, SS.c, SS.row]}>
					<Spinner size='small' color='gray' />
					<Text style={[SS.cS, SS.fz16, SS.pl10]}>{I18n.t('assets.requestAssets')}</Text>
				</View>
			)}
		</>
	);
};
export const ActivityList = ({ search }) => {
	const [list] = useStore('common.hisList');
	const [isShowAssets] = useStore('common.showAssets');
	const [isRequestHis] = useStore('common.isRequestHis');
	const showList = list.filter(
		(e) => !search || (e.address || '').toLocaleUpperCase().includes(search.toLocaleUpperCase())
	);
	const ListEl = useMemo(() => {
		return showList.map((e, j) => {
			const isOutto = [1, 3].includes(e.type);
			const isStake = [2, 3].includes(e.type);
			const isSign = [4].includes(e.type);
			let FromToEl = null;
			if (isSign) {
				FromToEl = <Text style={[SS.fz17, SS.mb5]}>{I18n.t('apps.signLabel')}</Text>;
			} else {
				if (isStake) {
					FromToEl = (
						<Text style={[SS.fz17, SS.mb5]}>{I18n.t(isOutto ? 'staking.unstake' : 'staking.stake')}</Text>
					);
				} else {
					FromToEl = (
						<Text style={[SS.fz17, SS.mb5]}>
							{isOutto ? 'To' : 'From'} : {(e.address || '').replace(/(^.{4})(.+)(.{4}$)/, '$1...$3')}
						</Text>
					);
				}
			}
			let AssetsEl = isShowAssets ? (
				<View>
					<Text style={[SS.fz15, SS.tr, SS.mb5]}>
						{isSign ? '' : isOutto ? '-' : '+'} {e.num} {e.coin}
					</Text>
					<Text style={[SS.fz15, SS.tr, SS.cS]}>$ {e.assets}</Text>
				</View>
			) : (
				<View>
					<Text style={[SS.fz15, SS.tr, SS.mb5]}>****</Text>
					<Text style={[SS.fz15, SS.tr, SS.cS]}>****</Text>
				</View>
			);
			return (
				<View key={e.id + j} style={[SS.row, SS.as, SS.mb20]}>
					<SvgIcon style={[SS.mr20]} name={isOutto ? 'outto' : 'into'} size={36} />
					<View style={[S.border(2, '#ccc'), SS.flex1, SS.row, SS.ac, SS.jsb, SS.pb20]}>
						<View>
							{FromToEl}
							<Text style={[SS.fz15, SS.cS]}>{dayjs(e.timestamp * 1000).format('YYYY-MM-DD HH:mm')}</Text>
						</View>
						{AssetsEl}
					</View>
				</View>
			);
		});
	}, [JSON.stringify(showList), isShowAssets]);
	return (
		<View>
			{ListEl}
			{!isRequestHis && (
				<View style={[SS.p30, SS.c, SS.row]}>
					<Spinner size='small' color='gray' />
					<Text style={[SS.cS, SS.fz16, SS.pl10]}>{I18n.t('assets.requestHis')}</Text>
				</View>
			)}
		</View>
	);
};

const imgW = (ThemeVar.deviceWidth - 20 * 2 - 16 * 2) / 3;
const CollectiblesItem = ({ name, list }) => {
	const [isOpen, setOpen] = useState(false);
	const [imgIndex, setImgIndex] = useState(0);
	const [isShowPre, setIsShowPre] = useState(false);
	const cacheList = ImageCache.get().cache || [];
	const images = list.map((e) => {
		return {
			...e,
			source: {
				url: cacheList[e.media]?.path || e.media
			},
			width: ThemeVar.deviceWidth,
			height: ThemeVar.deviceWidth
		};
	});
	return (
		<View>
			<TouchableOpacity
				onPress={() => {
					setOpen(!isOpen);
				}}
				activeOpacity={0.7}
				style={[SS.row, SS.ac, S.h(64)]}>
				<SvgIcon size={14} name='up' style={[!isOpen && { transform: [{ rotate: '180deg' }] }]} />
				<Image style={[S.wh(32), SS.mr10, SS.ml15]} source={{ uri: Base.getIcon('SMR') }} />
				<Text>{name}</Text>
				<View style={[SS.bgS, SS.ml10, SS.ph5, S.paddingV(3), S.radius(4)]}>
					<Text style={[SS.fz12]}>{list.length}</Text>
				</View>
			</TouchableOpacity>
			{isOpen && (
				<View style={[SS.row, SS.ac, { flexWrap: 'wrap' }]}>
					{list.map((e, i) => {
						return (
							<TouchableOpacity
								key={`${e.uid}_${i}`}
								activeOpacity={0.7}
								onPress={() => {
									setImgIndex(i);
									setIsShowPre(true);
								}}>
								<CachedImage
									style={[
										S.radius(8),
										S.wh(imgW),
										S.marginH(parseInt(i % 3) == 1 ? 16 : 0),
										S.marginB(15)
									]}
									source={{ uri: e.media }}
								/>
							</TouchableOpacity>
						);
					})}
				</View>
			)}
			<ImageView
				glideAlways
				images={images}
				imageIndex={imgIndex}
				animationType='fade'
				isVisible={isShowPre}
				onClose={() => setIsShowPre(false)}
				onImageChange={(index) => {
					setImgIndex(index);
				}}
			/>
		</View>
	);
};
export const CollectiblesList = () => {
	const [curWallet] = useGetNodeWallet();
	useGetNftList(curWallet);
	const [list] = useStore('nft.list');
	const ListEl = useMemo(() => {
		return list.map((e) => {
			return <CollectiblesItem key={e.collection} {...e} />;
		});
	}, [JSON.stringify(list)]);
	return <View>{ListEl}</View>;
};
