import React, { useState } from 'react';
import { View, Text } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { S, SS, StakingTokenItem, SvgIcon, ThemeVar } from '@/common';
import { I18n } from '@tangle-pay/common';
import { useStore } from '@tangle-pay/store';
import dayjs from 'dayjs';
import { SvgXml } from 'react-native-svg';
import _get from 'lodash/get';
const dotBgDic = {
	1: '#FCB11D',
	2: '#13BD00',
	3: '#D0D1D2',
	4: '#3671EE'
};
const Title = ({ type }) => {
	const bg = dotBgDic[type];
	const labelDic = {
		1: 'staking.stake',
		2: 'staking.addAmount',
		3: 'staking.unstake',
		4: 'staking.addAirdrop'
	};
	return (
		<View style={[SS.row, SS.ac]}>
			<View style={[S.bg(bg), S.wh(8), SS.radius10, SS.mr5]}></View>
			<Text style={[SS.fz16, SS.fw500]}>{I18n.t(labelDic[type])}</Text>
		</View>
	);
};
const Item = (props) => {
	const [isShow, setShow] = useState(false);
	const { type, amount, time, tokens } = props;
	const token1 = tokens.slice(0, 3);
	const token2 = tokens.slice(3);
	return (
		<View style={[SS.ph25, SS.pt25, { opacity: type == 3 ? 0.5 : 1 }]}>
			<View style={[SS.row, SS.ac, SS.jsb, SS.mb15]}>
				<Title type={type} />
				<Text style={[SS.fz12]}>{dayjs(time * 1000).format('MM.DD.YYYY HH:mm:ss')}</Text>
			</View>
			<View style={[SS.row, SS.ac, SS.jsb, SS.mb15]}>
				<Text style={[SS.fz12, SS.cS, SS.ml20]}>{I18n.t('staking.amount')}</Text>
				<Text>{amount} Mi</Text>
			</View>
			<View style={[SS.row, SS.ac, SS.jsb, SS.mb10]}>
				<Text style={[SS.fz12, SS.cS, SS.ml20]}>{I18n.t('staking.token')}</Text>
				<View style={[SS.row, SS.ac]}>
					{token1.map((e, i) => {
						return <StakingTokenItem key={i} coin={e.token} style={[SS.ml5]} />;
					})}
				</View>
			</View>
			{token2.length > 0 && !isShow && (
				<View style={[SS.je, SS.row]}>
					<TouchableOpacity
						activeOpacity={0.8}
						style={[SS.row, SS.ac, SS.pb10]}
						onPress={() => setShow(!isShow)}>
						<Text style={[SS.pr5, SS.fz12, SS.cP]}>View all</Text>
						<SvgIcon name='down' size={10} color={ThemeVar.brandPrimary} />
					</TouchableOpacity>
				</View>
			)}
			{isShow && (
				<View style={[SS.row, SS.ac, SS.je]}>
					<View style={[SS.row, SS.ac]}>
						{token2.map((e, i) => {
							return <StakingTokenItem key={i} coin={e.token} style={[SS.ml5, SS.mb10]} />;
						})}
					</View>
				</View>
			)}
			<View style={[SS.pt15]}>
				<SvgXml
					width='100%'
					height={1}
					xml={`
                <svg width="342" height="1" viewBox="0 0 342 1" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line y1="0.5" x2="342" y2="0.5" stroke="#D8D8D8" stroke-dasharray="2 4"/>
                </svg>`}
				/>
			</View>
		</View>
	);
};

export const List = () => {
	const [list] = useStore('staking.historyList');
	const [{ rewards }] = useStore('staking.config');
	const newList = list.map((e) => {
		const tokens = e.tokens.map((d) => {
			const token = d.token;
			let unit = _get(rewards, `${token}.unit`) || token;
			return { ...d, token: unit };
		});
		return { ...e, tokens };
	});
	newList.reverse();
	return (
		<View>
			{newList.map((e, i) => {
				return (
					<View key={i}>
						<Item {...e} />
					</View>
				);
			})}
		</View>
	);
};
