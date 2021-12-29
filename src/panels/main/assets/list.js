import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { View, Text, Spinner } from 'native-base';
import { I18n, Base } from '@tangle-pay/common';
import { useStore } from '@tangle-pay/store';
import { useGetLegal } from '@tangle-pay/store/common';
import dayjs from 'dayjs';
import { S, SS, SvgIcon } from '@/common';

export const CoinList = () => {
	const [isShowAssets] = useStore('common.showAssets');
	const [assetsList] = useStore('common.assetsList');
	const curLegal = useGetLegal();
	const [isRequestAssets] = useStore('common.isRequestAssets');
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
						style={[SS.row, SS.ac, SS.mb10]}>
						<Image
							style={[S.wh(45), S.radius(45), SS.mr25, SS.mb10]}
							source={{ uri: Base.getIcon(e.name) }}
						/>
						<View style={[S.border(2, '#ccc'), SS.flex1, SS.row, SS.ac, SS.jsb, SS.pb10]}>
							<Text style={[SS.fz17]}>{e.name}</Text>
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
			{!isRequestAssets && (
				<View style={[SS.p30, SS.c, SS.row]}>
					<Spinner size='small' color='gray' />
					<Text style={[SS.cS, SS.fz16, SS.pl10]}>{I18n.t('assets.requestAssets')}</Text>
				</View>
			)}
		</View>
	);
};
export const ActivityList = ({ search }) => {
	const [list] = useStore('common.hisList');
	const [isShowAssets] = useStore('common.showAssets');
	const [isRequestHis] = useStore('common.isRequestHis');
	const showList = list.filter((e) => !search || e.address.toLocaleUpperCase().includes(search.toLocaleUpperCase()));
	return (
		<View>
			{showList.map((e) => {
				const isOutto = [1, 3].includes(e.type);
				const isStake = [2, 3].includes(e.type);
				return (
					<View key={e.id} style={[SS.row, SS.as, SS.mb20]}>
						<SvgIcon style={[SS.mr20]} name={isOutto ? 'outto' : 'into'} size={36} />
						<View style={[S.border(2, '#ccc'), SS.flex1, SS.row, SS.ac, SS.jsb, SS.pb20]}>
							<View>
								{isStake ? (
									<Text style={[SS.fz17, SS.mb5]}>
										{I18n.t(isOutto ? 'staking.unstake' : 'staking.stake')}
									</Text>
								) : (
									<Text style={[SS.fz17, SS.mb5]}>
										{isOutto ? 'To' : 'From'} : {e.address.replace(/(^.{4})(.+)(.{4}$)/, '$1...$3')}
									</Text>
								)}
								<Text style={[SS.fz15, SS.cS]}>
									{dayjs(e.timestamp * 1000).format('YYYY-MM-DD HH:mm')}
								</Text>
							</View>
							{isShowAssets ? (
								<View>
									<Text style={[SS.fz15, SS.tr, SS.mb5]}>
										{isOutto ? '-' : '+'} {e.num} {e.coin}
									</Text>
									<Text style={[SS.fz15, SS.tr, SS.cS]}>$ {e.assets}</Text>
								</View>
							) : (
								<View>
									<Text style={[SS.fz15, SS.tr, SS.mb5]}>****</Text>
									<Text style={[SS.fz15, SS.tr, SS.cS]}>****</Text>
								</View>
							)}
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
