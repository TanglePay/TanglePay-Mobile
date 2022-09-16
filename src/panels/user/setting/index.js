import React, { useEffect, useState } from 'react';
import { Container, Content, View, Text, Switch } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { Base, I18n, IotaSDK } from '@tangle-pay/common';
import { useStore } from '@tangle-pay/store';
import { S, SS, Nav, SvgIcon } from '@/common';
import { ImageCache } from 'react-native-img-cache';
import RNFetchBlob from 'rn-fetch-blob';
import _sumBy from 'lodash/sumBy';

export const UserSetting = () => {
	useStore('common.lang');
	const [disTrace, setDisTrace] = useStore('common.disTrace');
	const [isNoRestake, setNoRestake] = useState(false);
	const [cache, setCache] = useState('0 M');
	const list = [
		{
			icon: 'lang',
			label: I18n.t('user.language'),
			path: 'user/lang'
		},
		{
			icon: 'cache',
			label: I18n.t('nft.clearCache'),
			value: cache,
			onPress: () => {
				ImageCache.get().clear();
				getCache();
			}
		},
		{
			icon: 'privacy',
			label: I18n.t('user.privacy'),
			tips: I18n.t('user.privacyTips'),
			type: 'switch',
			value: disTrace == 1,
			onChange: (e) => setDisTrace(e ? 1 : 0)
		},
		{
			icon: 'stake',
			label: I18n.t('staking.restake'),
			type: 'switch',
			value: isNoRestake,
			onChange: (e) => {
				setNoRestake(e);
				Base.setLocalData('common.isNoRestake', e ? 0 : 1);
			}
		}
	];
	const curNodeKey = IotaSDK?.curNode?.curNodeKey;
	if (curNodeKey) {
		list.push({
			icon: 'network',
			label: I18n.t('user.network'),
			value: curNodeKey,
			hideArrow: true
		});
	}
	useEffect(() => {
		Base.getLocalData('common.isNoRestake').then((res) => {
			setNoRestake(res != 1);
		});
		getCache();
	}, []);
	const getCache = async () => {
		const { cache } = ImageCache.get();
		const requestList = [];
		for (const i in cache) {
			const path = cache[i].path;
			requestList.push(RNFetchBlob.fs.stat(path));
		}
		const list = await Promise.all(requestList);
		const totalSize = _sumBy(list, 'size');
		setCache(Base.formatNum(totalSize / 1024 / 1024) + ' M');
	};
	return (
		<Container>
			<Nav title={I18n.t('user.setting')} />
			<Content>
				<View>
					{list.map((e, i) => {
						return (
							<TouchableOpacity
								activeOpacity={0.8}
								onPress={() => {
									if (e.onPress) {
										e.onPress();
									} else if (e.path) {
										Base.push(e.path);
									}
								}}
								key={i}
								style={[SS.row, SS.ac, SS.jsb, SS.p16, S.border(2)]}>
								<View style={[SS.row, SS.ac]}>
									<SvgIcon name={e.icon} size={24} />
									<Text style={[SS.fz16, SS.ml12]}>{e.label}</Text>
									{e.tips && <Text style={[SS.fz11, SS.ml10, SS.cS, SS.mt5]}>{e.tips}</Text>}
								</View>
								{e.type === 'switch' ? (
									<Switch value={e.value} onValueChange={e.onChange} />
								) : (
									<View style={[SS.row, SS.ac]}>
										{e.value && <Text style={[SS.fz13, SS.cS]}>{e.value}</Text>}
										{!e.hideArrow ? (
											<View style={[SS.ml10]}>
												<SvgIcon size={16} name='right' />
											</View>
										) : null}
									</View>
								)}
							</TouchableOpacity>
						);
					})}
				</View>
			</Content>
		</Container>
	);
};
