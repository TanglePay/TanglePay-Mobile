import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { View, Text, Spinner } from 'native-base';
import { I18n, Base } from '@tangle-pay/common';
import { useStore } from '@tangle-pay/store';
import { useGetLegal } from '@tangle-pay/store/common';
import dayjs from 'dayjs';
import { S, SS, SvgIcon } from '@/common';
import { useGetNodeWallet } from '@tangle-pay/store/common';
import { useGetRewards } from '@tangle-pay/store/staking';
import _get from 'lodash/get';

const itemH = 80;
export const CoinList = () => {
	const [isShowAssets] = useStore('common.showAssets');
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
								{statedAmount > 0 && (
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
	const [list, setList] = useState([]);
	const [curWallet] = useGetNodeWallet();
	const stakedRewards = useGetRewards(curWallet.address);
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
	return (
		<>
			{list.length <= 0
				? null
				: list.map((e) => {
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
				  })}
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
	return (
		<View>
			{showList.map((e, j) => {
				const isOutto = [1, 3].includes(e.type);
				const isStake = [2, 3].includes(e.type);
				const isSign = [4].includes(e.type);
				let FromToEl = null;
				if (isSign) {
					FromToEl = <Text style={[SS.fz17, SS.mb5]}>{I18n.t('apps.signLabel')}</Text>;
				} else {
					if (isStake) {
						FromToEl = (
							<Text style={[SS.fz17, SS.mb5]}>
								{I18n.t(isOutto ? 'staking.unstake' : 'staking.stake')}
							</Text>
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
								<Text style={[SS.fz15, SS.cS]}>
									{dayjs(e.timestamp * 1000).format('YYYY-MM-DD HH:mm')}
								</Text>
							</View>
							{AssetsEl}
						</View>
					</View>
				);
			})}
			{!isRequestHis && (
				<View style={[SS.p30, SS.c, SS.row]}>
					<Spinner size='small' color='gray' />
					<Text style={[SS.cS, SS.fz16, SS.pl10]}>{I18n.t('assets.requestHis')}</Text>
				</View>
			)}
		</View>
	);
};
