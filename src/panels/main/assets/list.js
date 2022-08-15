import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Image, TouchableOpacity, PermissionsAndroid } from 'react-native';
import { View, Text, Spinner } from 'native-base';
import { I18n, Base, IotaSDK } from '@tangle-pay/common';
import { useStore } from '@tangle-pay/store';
import { useGetLegal, useGetNodeWallet } from '@tangle-pay/store/common';
import dayjs from 'dayjs';
import { S, SS, SvgIcon, ThemeVar } from '@/common';
import _get from 'lodash/get';
import { useGetNftList } from '@tangle-pay/store/nft';
import ImageView from 'react-native-image-view';
import { CachedImage, ImageCache } from 'react-native-img-cache';
import CameraRoll from '@react-native-community/cameraroll';

const itemH = 64;
export const CoinList = () => {
	const [isShowAssets] = useStore('common.showAssets');
	const [needRestake] = useStore('staking.needRestake');
	const [statedAmount] = useStore('staking.statedAmount');
	let [assetsList] = useStore('common.assetsList');
	const curLegal = useGetLegal();
	const contractList = IotaSDK.curNode?.contractList || [];
	assetsList = assetsList.filter((e) => {
		const { name } = e;
		if (!e.contract) {
			return true;
		}
		const contract = contractList.find((e) => e.token === name)?.contract;
		return IotaSDK.contracAssetsShowDic[contract] || e.realBalance > 0;
	});
	return (
		<View>
			{assetsList.map((e) => {
				return (
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => {
							Base.push('assets/send', { currency: e.name });
						}}
						key={e.name}
						style={[SS.row, SS.ac, { height: itemH }]}>
						<Image
							style={[S.wh(48), S.radius(48), SS.mr12, S.border(4)]}
							source={{ uri: Base.getIcon(e.name) }}
						/>
						<View style={[S.border(2), SS.flex1, SS.row, SS.ac, SS.jsb, { height: itemH }]}>
							<View style={[SS.ac, SS.row]}>
								<Text style={[SS.fz16]}>{e.name}</Text>
								{!IotaSDK.isWeb3Node && statedAmount > 0 && !needRestake && (
									<View
										style={[
											SS.ml16,
											S.border(4, '#4A4A4D'),
											S.radius(4),
											{ paddingHorizontal: 4, paddingVertical: 0 }
										]}>
										<Text style={[SS.fz10, { color: '#4A4A4D' }]}> {I18n.t('staking.title')}</Text>
									</View>
								)}
							</View>
							{isShowAssets ? (
								<View>
									<Text style={[SS.fz14, SS.tr, SS.mb4]}>
										{e.balance} {e.unit || e.name}
									</Text>
									<Text style={[SS.fz12, SS.tr, SS.cS]}>
										{curLegal.unit} {e.assets}
									</Text>
								</View>
							) : (
								<View>
									<Text style={[SS.fz14, SS.tr, SS.mb4]}>****</Text>
									<Text style={[SS.fz12, SS.tr, SS.cS]}>****</Text>
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
			if (item.amount > 0 && item.minimumReached) {
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
	}, [JSON.stringify(stakedRewards), JSON.stringify(rewards), curWallet?.address + curWallet?.nodeId]);
	const ListEl = useMemo(() => {
		return list.map((e) => {
			return (
				<View key={e.symbol} style={[SS.row, SS.ac, { opacity: 0.6, height: itemH }]}>
					<Image
						style={[S.wh(48), S.radius(48), SS.mr12, S.border(4)]}
						source={{ uri: Base.getIcon(e.symbol) }}
					/>
					<View style={[S.border(2), SS.flex1, SS.row, SS.ac, SS.jsb, { height: itemH }]}>
						<Text style={[SS.fz16]}>{e.unit}</Text>
						{isShowAssets ? (
							<View>
								<Text style={[SS.fz14, SS.tr]}>{e.amountLabel}</Text>
							</View>
						) : (
							<View>
								<Text style={[SS.fz14, SS.tr]}>****</Text>
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
				<View style={[SS.p16, SS.c, SS.row]}>
					<Spinner size='small' color='gray' />
					<Text style={[SS.cS, SS.fz16, SS.pl10]}>{I18n.t('assets.requestAssets')}</Text>
				</View>
			)}
		</>
	);
};
export const ActivityList = ({ search, setHeight }) => {
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
				FromToEl = <Text style={[SS.fz16, SS.mb5]}>{I18n.t('apps.signLabel')}</Text>;
			} else {
				if (isStake) {
					FromToEl = (
						<Text style={[SS.fz16, SS.mb5]}>{I18n.t(isOutto ? 'staking.unstake' : 'staking.stake')}</Text>
					);
				} else {
					FromToEl = (
						<Text style={[SS.fz16, SS.mb5]}>
							{isOutto ? 'To' : 'From'} : {(e.address || '').replace(/(^.{4})(.+)(.{4}$)/, '$1...$3')}
						</Text>
					);
				}
			}
			let AssetsEl = isShowAssets ? (
				<View>
					<Text style={[SS.fz14, SS.tr, SS.mb5]}>
						{isSign ? '' : isOutto ? '-' : '+'} {e.num} {e.coin}
					</Text>
					<Text style={[SS.fz14, SS.tr, SS.cS]}>$ {e.assets}</Text>
				</View>
			) : (
				<View>
					<Text style={[SS.fz14, SS.tr, SS.mb5]}>****</Text>
					<Text style={[SS.fz14, SS.tr, SS.cS]}>****</Text>
				</View>
			);
			return (
				<TouchableOpacity
					activeOpacity={e.viewUrl ? 0.8 : 1}
					key={e.id + j}
					style={[SS.row, SS.as, SS.pt16]}
					onPress={() => {
						e.viewUrl && Base.push(e.viewUrl);
					}}>
					<SvgIcon style={[SS.mr16]} name={isOutto ? 'outto' : 'into'} size={36} />
					<View style={[S.border(2), SS.flex1, SS.row, SS.ac, SS.jsb, SS.pb16]}>
						<View>
							{FromToEl}
							<Text style={[SS.fz14, SS.cS]}>{dayjs(e.timestamp * 1000).format('YYYY-MM-DD HH:mm')}</Text>
						</View>
						{AssetsEl}
					</View>
				</TouchableOpacity>
			);
		});
	}, [JSON.stringify(showList), isShowAssets]);
	return (
		<View
			onLayout={(e) => {
				setHeight(e.nativeEvent.layout.height);
			}}>
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

const ViewFooter = (data) => {
	const [isShow, setShow] = useState(true);
	const [showTips, setShowTips] = useState('');
	const timeHandler = useRef();
	const saveHandler = useRef();
	useEffect(() => {
		if (showTips) {
			setShow(true);
			timeHandler.current = setTimeout(() => {
				setShowTips('');
			}, 3000);
		}
	}, [showTips]);
	useEffect(() => {
		return () => {
			clearTimeout(timeHandler.current);
			clearTimeout(saveHandler.current);
		};
	}, []);
	if (!isShow) {
		return null;
	}
	return (
		<View style={{ paddingBottom: ThemeVar.Inset.portrait.bottomInset + 40 }}>
			{!showTips ? (
				<TouchableOpacity
					hitSlop={{ top: 15, left: 15, right: 15, bottom: 15 }}
					style={{
						position: 'absolute',
						zIndex: 100,
						right: 10,
						height: 40,
						width: 40,
						borderRadius: 20,
						backgroundColor: 'rgba(255,255,255,0.2)',
						alignItems: 'center',
						justifyContent: 'center'
					}}
					onPress={() => {
						setShow(false);
						const save = () => {
							const cache = ImageCache.get()?.cache;
							const cachePath = cache?.[data.media]?.path;
							const downloading = cache?.[data.media]?.downloading;
							if (!cachePath || downloading) {
								saveHandler.current = setTimeout(save, 3000);
								return;
							}
							CameraRoll.save(cachePath, { type: 'photo', album: 'tanglepay' }).then(() => {
								setShowTips(I18n.t('nft.saved'));
							});
						};
						save();
					}}>
					<Image style={{ width: 20, height: 20 }} source={require('./download.png')} />
				</TouchableOpacity>
			) : (
				<View style={{ position: 'absolute', zIndex: 100, right: 10, marginTop: 10 }}>
					<Text style={{ color: '#fff' }}>{showTips}</Text>
				</View>
			)}
		</View>
	);
};

const imgW = (ThemeVar.deviceWidth - 20 * 2 - 16 * 2) / 3;
const CollectiblesItem = ({ logo, name, link, list }) => {
	const [isOpen, setOpen] = useState(false);
	const [imgIndex, setImgIndex] = useState(0);
	const [isShowPre, setIsShowPre] = useState(false);
	const images = list.map((e) => {
		return {
			...e,
			source: {
				uri: e.imageType === 'mp4' ? e.thumbnailImage : e.media
			},
			width: ThemeVar.deviceWidth,
			height: ThemeVar.deviceHeight
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
				<CachedImage style={[S.wh(32), S.radius(4), SS.mr10, SS.ml15]} source={{ uri: Base.getIcon(logo) }} />
				<Text>{name}</Text>
				<View style={[SS.bgS, SS.ml10, SS.ph5, S.paddingV(3), S.radius(4)]}>
					<Text style={[SS.fz12]}>{list.length}</Text>
				</View>
			</TouchableOpacity>
			{isOpen &&
				(list.length > 0 ? (
					<View style={[SS.row, SS.ac, { flexWrap: 'wrap' }, S.border(2)]}>
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
										resizeMode='contain'
										source={{ uri: e.thumbnailImage || e.media }}
									/>
								</TouchableOpacity>
							);
						})}
					</View>
				) : (
					<View style={[SS.c, SS.pb25, SS.pt10, S.border(2)]}>
						<Text style={[SS.fz15, SS.cS]}>
							{I18n.t('nft.zeroTips').replace('{name}', name)}
							{/* {' '}<Text
								style={[SS.cP]}
								onPress={() => {
									Base.push(link);
								}}>
								{I18n.t('nft.goBuy')}
							</Text> */}
						</Text>
					</View>
				))}
			<ImageView
				glideAlways
				images={images}
				imageIndex={imgIndex}
				animationType='fade'
				isVisible={isShowPre}
				onClose={() => setIsShowPre(false)}
				renderFooter={(data) => <ViewFooter {...data} />}
				onImageChange={(index) => {
					setImgIndex(index);
				}}
			/>
		</View>
	);
};
export const CollectiblesList = ({ setHeight }) => {
	const [isRequestNft] = useStore('nft.isRequestNft');
	useEffect(() => {
		const requestCameraPermission = async () => {
			if (ThemeVar.platform === 'android') {
				try {
					const granteds = await PermissionsAndroid.requestMultiple([
						PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
						PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
					]);
				} catch (err) {}
			}
		};
		requestCameraPermission();
	}, []);
	useGetNftList();
	const [list] = useStore('nft.list');
	const ListEl = useMemo(() => {
		return list.map((e) => {
			return <CollectiblesItem key={e.space} {...e} />;
		});
	}, [JSON.stringify(list)]);
	return (
		<View
			onLayout={(e) => {
				setHeight(e.nativeEvent.layout.height);
			}}>
			{ListEl}
			{!isRequestNft && (
				<View style={[SS.c, SS.row]}>
					<Spinner size='small' color='gray' />
					<Text style={[SS.cS, SS.fz16, SS.pl10]}>{I18n.t('assets.requestAssets')}</Text>
				</View>
			)}
		</View>
	);
};
