import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Image, TouchableOpacity, PermissionsAndroid } from 'react-native';
import { View, Text, Spinner } from 'native-base';
import { I18n, Base, IotaSDK, API_URL } from '@tangle-pay/common';
import { useStore } from '@tangle-pay/store';
import { useGetLegal, useGetNodeWallet } from '@tangle-pay/store/common';
import dayjs from 'dayjs';
import { S, SS, SvgIcon, ThemeVar } from '@/common';
import _get from 'lodash/get';
import ImageView from 'react-native-image-view';
import { CachedImage, ImageCache } from 'react-native-img-cache';
import CameraRoll from '@react-native-community/cameraroll';
import WebView from 'react-native-webview';

const itemH = 64;
export const CoinList = ({ setHeight }) => {
	const [isShowAssets] = useStore('common.showAssets');
	const [hideIcon, setHideIcon] = useState({});
	const [needRestake] = useStore('staking.needRestake');
	const [statedAmount] = useStore('staking.statedAmount');
	let [assetsList] = useStore('common.assetsList');
	const [ipfsDic, setIpfsDic] = useState({});
	const contractList = IotaSDK.curNode?.contractList || [];
	assetsList = assetsList.filter((e) => {
		const { name } = e;
		if (!e.contract) {
			return true;
		}
		const contractItem = contractList.find((e) => e.token === name);
		const contract = contractItem?.contract;
		const isShowZero = !contractItem?.isSystem || IotaSDK.contracAssetsShowDic[contract];
		return e.realBalance > 0 || isShowZero;
	});
	const isSMRNode = IotaSDK.checkSMR(IotaSDK.curNode?.id);
	const ipfsList = assetsList.filter((e) => e.logoUrl && /ipfs/.test(e.logoUrl)).map((e) => e.logoUrl);
	useEffect(() => {
		Promise.all(
			ipfsList.map((e) => {
				return fetch(e).then((res) => res.json());
			})
		).then((res) => {
			const dic = {};
			ipfsList.forEach((e, i) => {
				dic[e] = res[i]?.image || '';
			});
			setIpfsDic(dic);
		});
	}, [JSON.stringify(ipfsList)]);
	return (
		<View
			onLayout={(e) => {
				setHeight(e.nativeEvent.layout.height);
			}}>
			{assetsList.map((e) => {
				const isSMR = isSMRNode && !e.isSMRToken;
				return (
					<View key={`${e.name}_${e.tokenId}_${e.contract}`} style={[SS.row, SS.ac, { height: itemH }]}>
						<TouchableOpacity
							activeOpacity={0.8}
							style={[SS.pr]}
							onPress={() => {
								if (e.isSMRToken) {
									Base.push('assets/tokenDetail', {
										tokenId: e.tokenId,
										standard: e.standard,
										name: e.name,
										logoUrl: e.logoUrl || Base.getIcon(e.tokenId)
									});
								} else {
									Base.push('assets/send', { currency: e.name, id: e.tokenId || e.contract || '' });
								}
							}}>
							<Image
								style={[
									S.wh(48),
									S.radius(48),
									SS.pa,
									SS.bgW,
									{ left: 0, top: 0, zIndex: 1, opacity: hideIcon[e.name] ? 0 : 1 },
									SS.mr12,
									S.border(4)
								]}
								source={{ uri: ipfsDic[e.logoUrl] || Base.getIcon(e.isSMRToken ? e.tokenId : e.name) }}
								onError={() => {
									setHideIcon((d) => {
										return { ...d, [e.name]: true };
									});
								}}
							/>
							<View style={[S.wh(48), S.radius(48), SS.mr12, S.border(4), SS.bgP, SS.c]}>
								<Text style={[SS.fz26, SS.cW, SS.fw600]}>{String(e.name).toLocaleUpperCase()[0]}</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity
							activeOpacity={0.8}
							onPress={() => {
								Base.push('assets/send', { currency: e.name, id: e.tokenId || e.contract || '' });
							}}
							style={[S.border(2), SS.flex1, SS.row, SS.ac, SS.jsb, { height: itemH }]}>
							<View style={[SS.ac, SS.row]}>
								<Text style={[SS.fz16]}>{String(e.name).toLocaleUpperCase()}</Text>
								{!IotaSDK.isWeb3Node && statedAmount > 0 && e.realBalance > 0 && !needRestake ? (
									<View
										style={[
											SS.ml16,
											S.border(4, '#4A4A4D'),
											S.radius(4),
											{ paddingHorizontal: 4, paddingVertical: 0 }
										]}>
										<Text style={[SS.fz10, { color: '#4A4A4D' }]}> {I18n.t('staking.title')}</Text>
									</View>
								) : null}
							</View>
							{isShowAssets ? (
								<View>
									<Text style={[SS.fz14, SS.tr, SS.mb4]}>
										{e.balance} {String(e.unit || e.name).toLocaleUpperCase()}
									</Text>
									{isSMR ? (
										<Text style={[SS.fz12, SS.tr, SS.cS]}>
											{I18n.t('staking.available')} {e.available}{' '}
										</Text>
									) : null}
								</View>
							) : (
								<View>
									<Text style={[SS.fz14, SS.tr, SS.mb4]}>****</Text>
									{isSMR ? (
										<Text style={[SS.fz12, SS.tr, SS.cS]}>
											{I18n.t('staking.available') + ' ****'}
										</Text>
									) : null}
								</View>
							)}
						</TouchableOpacity>
					</View>
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
	const [checkClaim] = useStore('common.checkClaim');
	useEffect(() => {
		const obj = {};
		const hasSMR = !!IotaSDK.nodes.find((e) => e.bech32HRP === 'smr');
		for (const i in stakedRewards) {
			const item = stakedRewards[i];
			if (item.amount > 0 && item.minimumReached) {
				const symbol = item.symbol;
				obj[symbol] = obj[symbol] || {
					...item,
					amount: 0,
					isSMR: hasSMR && symbol.includes('SMR')
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
		let arr = Object.values(obj);
		arr.sort((a) => (a.isSMR ? -1 : 0));
		// if (checkClaim) {
		arr = arr.filter((e) => !e.isSMR);
		// }
		setList(arr);
	}, [checkClaim, JSON.stringify(stakedRewards), JSON.stringify(rewards), curWallet?.address + curWallet?.nodeId]);
	const ListEl = useMemo(() => {
		return list.map((e) => {
			return (
				<TouchableOpacity
					key={e.symbol}
					activeOpacity={e.isSMR ? 0.8 : 1}
					onPress={() => {
						if (e.isSMR) {
							Base.push('assets/claimReward/claimSMR', {
								id: curWallet.id
							});
						}
					}}>
					<View style={[SS.row, SS.ac, { opacity: e.isSMR ? 1 : 0.6, height: itemH }]}>
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
				</TouchableOpacity>
			);
		});
	}, [JSON.stringify(list), isShowAssets]);
	return list.length <= 0 ? null : ListEl;
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
			const isContract = e.contractDetail;
			const isOutto = [1, 3, 6, 8].includes(e.type);
			const isStake = [2, 3].includes(e.type);
			const isSign = [4].includes(e.type);
			const isNft = [7, 8].includes(e.type);
			let FromToEl = null;
			if (isContract) {
				FromToEl = <Text style={[SS.fz16, SS.mb5]}>{e.contractDetail.abiFunc}</Text>;
			} else if (isSign) {
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
				isContract ? null : (
					<View>
						<Text numberOfLines={1} style={[SS.fz14, SS.tr, SS.mb5, { maxWidth: 140 }]}>
							{isSign ? '' : isOutto ? '-' : '+'} {!isNft ? `${e.num} ` : ''}
							{e.coin}
						</Text>
						<Text style={[SS.fz14, SS.tr, SS.cS]}>$ {e.assets}</Text>
					</View>
				)
			) : (
				<View>
					<Text style={[SS.fz14, SS.tr, SS.mb5]}>****</Text>
					<Text style={[SS.fz14, SS.tr, SS.cS]}>****</Text>
				</View>
			);
			if (isStake) {
				AssetsEl = null;
			}
			return (
				<TouchableOpacity
					activeOpacity={e.viewUrl ? 0.8 : 1}
					key={e.id + j}
					style={[SS.row, SS.as, SS.pt16]}
					onPress={() => {
						e.viewUrl && Base.push(e.viewUrl);
					}}>
					<SvgIcon
						style={[SS.mr16]}
						name={isContract ? 'interaction' : isOutto ? 'outto' : 'into'}
						size={36}
					/>
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
export const checkImgIsSVG = (img) => img && img.startsWith('data:image/svg+xml');
// NFT SVG is not well supported by react-native-svg, so use WebView as an alternative
export const SVGViewer = ({ style, src }) => (
	<View style={[...style]}>
		<WebView
			style={{ backgroundColor: 'transparent' }}
			originWhitelist={['*']}
			onMessage={(event) => {}}
			source={{
				html: `
				<!DOCTYPE html>
				<html lang="en">
						<head>
								<meta charset="UTF-8" />
								<meta name="viewport" content="width=device-width, initial-scale=1.0" />
								<style>
										body {
												padding: 0;
												margin: 0;
										}
										.content {
												display: flex;
												align-items: center;
												justify-content: center;
												width: 100vw;
												height: 100vh;
										}
										img {
												max-width: 100%;
												max-height: 100%;
										}
								</style>
						</head>
						<body>
								<div class="content">
										<img src="${src}" alt="" />
								</div>
						</body>
				</html>
				`
			}}
		/>
	</View>
);

const CollectiblesItem = ({ logo, name, link, list }) => {
	const [isOpen, setOpen] = useState(false);
	const [imgIndex, setImgIndex] = useState(0);
	const [hideIcon, setHideIcon] = useState(false);
	const [isShowPre, setIsShowPre] = useState(false);
	const isSMRNode = IotaSDK.checkSMR(IotaSDK.curNode?.id);
	const isEvm = IotaSDK.checkWeb3Node(IotaSDK.curNode?.id);
	const images = list.map((e) => {
		return {
			...e,
			source: {
				uri: e.imageType === 'mp4' ? e.thumbnailImage : e.media
			},
			width: ThemeVar.deviceWidth,
			height: ThemeVar.deviceHeight,
			renderItem: checkImgIsSVG(e.media)
				? () => {
						return <SVGViewer src={e.media} style={[S.wh(ThemeVar.deviceWidth)]} />;
				  }
				: null
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
				{!hideIcon ? (
					<CachedImage
						style={[S.wh(32), S.radius(4), SS.mr10, SS.ml15]}
						source={{ uri: Base.getIcon(logo) }}
						onError={() => {
							setHideIcon(true);
						}}
					/>
				) : (
					<View style={[S.wh(32), S.radius(32), SS.mr10, SS.ml15, S.border(4), SS.bgP, SS.c]}>
						<Text style={[SS.fz26, SS.cW, SS.fw600]}>{String(logo).toLocaleUpperCase()[0]}</Text>
					</View>
				)}
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
								<View key={`${e.uid}_${i}`} style={[SS.pr]}>
									<View
										style={[
											SS.ac,
											SS.jsb,
											SS.pa,
											S.w(imgW),
											SS.row,
											S.marginH(parseInt(i % 3) == 1 ? 16 : 0),
											{
												borderTopLeftRadius: 8,
												borderTopRightRadius: 8,
												zIndex: 3,
												height: 30,
												left: 0,
												backgroundColor: 'rgba(0,0,0,0.5)'
											}
										]}>
										<SvgIcon
											onPress={() => {
												setImgIndex(i);
												setIsShowPre(true);
											}}
											size={20}
											style={[SS.ml4]}
											name='eye_1'
											color='#ffffff'
										/>
										{(isSMRNode && e.nftId && e.isUnlock) || (isEvm && e.tokenId) ? (
											<SvgIcon
												onPress={() => {
													if (
														(isSMRNode && e.nftId) ||
														(isEvm && e.tokenId && e.collectionId)
													) {
														Base.push('assets/send', {
															nftId: e.nftId || e.tokenId,
															collectionId: e.collectionId,
															currency: e.name,
															nftImg: e.thumbnailImage || e.media
														});
													}
												}}
												size={18}
												style={[SS.mr4]}
												name='send'
												color='#ffffff'
											/>
										) : null}
									</View>
									<TouchableOpacity
										activeOpacity={0.8}
										onPress={() => {
											Base.push('assets/nftDetail', {
												...e
											});
										}}>
										{checkImgIsSVG(e.media) ? (
											<SVGViewer
												src={e.media}
												style={[
													S.radius(8),
													S.wh(imgW),
													S.marginH(parseInt(i % 3) == 1 ? 16 : 0),
													S.marginB(15),
													SS.bgS
												]}
											/>
										) : (
											<CachedImage
												style={[
													S.radius(8),
													S.wh(imgW),
													S.marginH(parseInt(i % 3) == 1 ? 16 : 0),
													S.marginB(15),
													SS.bgS
												]}
												resizeMode='contain'
												source={{ uri: e.thumbnailImage || e.media }}
											/>
										)}
									</TouchableOpacity>
								</View>
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
	const [curWallet] = useGetNodeWallet();

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
	const [list] = useStore('nft.list');
	let [importedNFT] = useStore('nft.importedList');

	const ListEl = useMemo(() => {
		return list.map((e) => {
			return <CollectiblesItem isLedger={curWallet.type == 'ledger'} key={e.space} {...e} />;
		});
	}, [JSON.stringify(list), curWallet.type]);
	return (
		<View
			onLayout={(e) => {
				setHeight(e.nativeEvent.layout.height);
			}}>
			{ListEl}
			{importedNFT &&
				Object.keys(importedNFT).map((key, index) => {
					const nft = importedNFT[key] ?? {};
					const { logo, name, list = [] } = nft;

					if (list.length === 0) {
						return null;
					}
					const firstNFT = list[0];
					return (
						<CollectiblesItem
							isLedger={curWallet.type === 'ledger'}
							logo={logo || name || firstNFT.name || 'NFT'}
							name={name ?? firstNFT.name}
							link={''}
							key={index}
							list={list.map((item) => ({ ...item, media: item.image }))}
						/>
					);
				})}
			{!isRequestNft && (
				<View style={[SS.c, SS.row]}>
					<Spinner size='small' color='gray' />
					<Text style={[SS.cS, SS.fz16, SS.pl10]}>{I18n.t('assets.requestAssets')}</Text>
				</View>
			)}
		</View>
	);
};
