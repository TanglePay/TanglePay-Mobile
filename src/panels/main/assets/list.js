import React, { useState, useImperativeHandle } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { View, Text, Spinner } from 'native-base';
import { S, SS, images, I18n, Base } from '@/common';
import { useStore } from '@/store';
import { useGetLegal } from '@/store/common';
import dayjs from 'dayjs';

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
						style={[SS.row, SS.as, SS.mb10]}>
						<Image style={[S.wh(35), S.radius(35), SS.mr25]} source={e.icon} />
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
				return (
					<View key={e.id} style={[SS.row, SS.as, SS.mb20]}>
						<Image
							style={[S.wh(25, 32.4), SS.mr25]}
							source={e.type === 1 ? images.com.outto : images.com.into}
						/>
						<View style={[S.border(2, '#ccc'), SS.flex1, SS.row, SS.ac, SS.jsb, SS.pb20]}>
							<View>
								<Text style={[SS.fz17, SS.mb5]}>
									{e.type === 1 ? 'To' : 'From'} :{' '}
									{e.address.replace(/(^.{4})(.+)(.{4}$)/, '$1...$3')}
								</Text>
								<Text style={[SS.fz15, SS.cS]}>
									{dayjs(e.timestamp * 1000).format('YYYY-MM-DD HH:mm')}
								</Text>
							</View>
							{isShowAssets ? (
								<View>
									<Text style={[SS.fz15, SS.tr, SS.mb5]}>
										{e.type === 1 ? '-' : '+'} {e.num} {e.coin}
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
