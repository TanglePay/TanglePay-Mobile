import React, { useEffect, useState } from 'react';
import { useStore } from '@tangle-pay/store';
import { useGetNftList } from '@tangle-pay/store/nft';
import { SvgIcon, Toast, SS, S } from '@/common';
import { useRoute } from '@react-navigation/native';
import { Base, I18n } from '@tangle-pay/common';
import Bridge from '@/common/bridge';
import { Container, View, Text, Button, Content } from 'native-base';
import { TouchableOpacity, Image } from 'react-native';

export const AssetsNftMerge = () => {
	const [isRequestNft] = useStore('nft.isRequestNft');
	let { params } = useRoute();
	params = params || {};
	useGetNftList();
	const [list] = useStore('nft.list');
	let allNftList = [];
	list.forEach((e) => {
		if (e.list) {
			e.list.forEach((d) => {
				allNftList.push({
					...d,
					space: e.space
				});
			});
		}
	});
	let filterNftList = [];
	allNftList.forEach((e) => {
		let isPush = true;
		for (const i in params) {
			if (Object.hasOwnProperty.call(params, i)) {
				const item = params[i];
				if (Array.isArray(item)) {
					if (!item.includes(e[i])) {
						isPush = false;
					}
				} else {
					if (item != e[i]) {
						isPush = false;
					}
				}
			}
		}
		if (isPush) {
			filterNftList.push(e);
		}
	});
	const selectCount = params.selectCount || 1;
	const [selectList, setSelectList] = useState([]);
	const isDisabled = selectList.length != selectCount;
	useEffect(() => {
		if (isRequestNft) {
			Toast.showLoading();
		} else {
			Toast.hideLoading();
		}
	}, [isRequestNft]);
	return (
		<Container>
			<View style={[SS.row, SS.ac, SS.jsb, SS.p16, S.border(2)]}>
				<View style={[SS.fz16, SS.fw600]}>{I18n.t('nft.selectHero')}</View>
				<Button
					disabled={isDisabled}
					onPress={() => {
						const infoList = [];
						filterNftList.forEach((e) => {
							if (selectList.includes(e.nftId)) {
								infoList.push(e);
							}
						});
						Bridge.sendMessage('iota_merge_nft', infoList);
					}}
					style={[
						SS.ph24,
						{
							borderRadius: 4,
							border: 0,
							background: isDisabled ? 'rgba(54, 113, 238, 0.2)' : 'rgba(54, 113, 238, 1)'
						}
					]}
					color='primary'>
					<Text style={[SS.fz14]}>{I18n.t('nft.nftAdd')}</Text>
				</Button>
			</View>
			<View>
				<Text style={[SS.fz16, SS.pv8, SS.ph16]}>
					{I18n.t('nft.totalNum').replace('{num}', filterNftList.length)}
				</Text>
				<View style={[SS.ph8]}>
					{filterNftList.map((e) => {
						const isSelect = selectList.includes(e.nftId);
						const ar = (e?.attributes || []).find((d) => d.trait_type == 'airdroprewardlevel')?.value || '';
						return (
							<TouchableOpacity
								activeOpacity={0.8}
								style={[SS.row, SS.ac, SS.jsb, SS.p8, SS.pr20, SS.bgS, SS.radius8, SS.mb8]}
								key={e.nftId}
								onPress={() => {
									let newList = [...selectList];
									if (isSelect) {
										newList.splice(selectList.indexOf(e.nftId), 1);
									} else {
										if (newList.length >= selectCount) {
											newList.shift();
										}
										newList.push(e.nftId);
									}
									setSelectList(newList);
								}}>
								<View style={[SS.row, SS.ac]}>
									<Image
										style={[S.wh(64), S.radius(8), SS.bgS]}
										resizeMode='contain'
										source={{ uri: e.thumbnailImage || e.media }}
									/>

									<Text style={[SS.ml12, SS.fz16, SS.fw500]}>AR: {ar}</Text>
								</View>
								<SvgIcon name='select' style={[isSelect ? SS.cP : SS.cS]} size='20' />
							</TouchableOpacity>
						);
					})}
				</View>
			</View>
		</Container>
	);
};
