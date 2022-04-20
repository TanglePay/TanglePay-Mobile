import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'native-base';
import { TouchableOpacity, Image } from 'react-native';
import { S, SS, SvgIcon, ThemeVar, StakingTokenItem, Toast } from '@/common';
import { I18n, Base } from '@tangle-pay/common';
import { useStore } from '@tangle-pay/store';
import { useGetNodeWallet } from '@tangle-pay/store/common';
import { useGetParticipationEvents, useGetRewards } from '@tangle-pay/store/staking';
import _get from 'lodash/get';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(advancedFormat);
dayjs.extend(utc);

const AmountCon = ({ amountList }) => {
	return (
		<View style={[SS.p20]}>
			<Text style={[SS.fz14, SS.fw600]}>{I18n.t('staking.amount')}</Text>
			{amountList.map((e, i) => {
				return (
					<View key={i} style={[SS.row, SS.jsb, SS.ac, SS.mt15]}>
						<View style={[SS.row, SS.ac]}>
							<StakingTokenItem coin={e.token} label={`${Base.formatNum(e.amount)}Mi`} />
							<Text style={[SS.fz12, SS.ml5, SS.cS]}>{e.statusStr}</Text>
						</View>
						{!!e.onPress && (
							<View>
								<Button
									disabled={e.btnDis}
									onPress={e.onPress}
									rounded
									small
									light
									style={[S.border(4, e.borderColor), S.bg('#e2e4e4')]}>
									<Text style={[{ minWidth: 90 }, SS.tc, { opacity: e.btnDis ? 0.3 : 1 }]}>
										{e.btnStr}
									</Text>
								</Button>
							</View>
						)}
					</View>
				);
			})}
		</View>
	);
};

// Upcoming
const Upcoming = ({ startTime, commenceTime, uncomingTokens, handleStaking }) => {
	const timeStr = dayjs(startTime * 1000)
		.utcOffset(60)
		.format('HH:mm CET, MMM Do YYYY');
	const showPre = dayjs(commenceTime * 1000).isBefore(dayjs());
	return (
		<View style={[S.bg(ThemeVar.headerStyle), SS.p20, SS.radius10]}>
			{showPre && (
				<Button block onPress={() => handleStaking(uncomingTokens, 1)}>
					<Text>{I18n.t('staking.preStake')}</Text>
				</Button>
			)}
			<View>
				<Text style={[SS.pv15, SS.fw600, SS.fz14]}>{I18n.t('staking.airdrops')}</Text>
				<View style={[SS.radius10, SS.bgW, SS.p15]}>
					<View style={[SS.row, SS.c]}>
						<SvgIcon name='time' size={14} color={ThemeVar.secondTextColor} />
						<Text style={[SS.font12, SS.fw500, SS.ml5, SS.cS]}>{I18n.t('staking.startAt')}</Text>
					</View>
					<View style={[SS.c, SS.mt10]}>
						<Text style={[SS.fz23, SS.fw500]}>{timeStr}</Text>
					</View>
				</View>
				{uncomingTokens.length > 0 && (
					<View style={[SS.row, SS.ac, SS.mt15, { flexWrap: 'wrap' }]}>
						{uncomingTokens.map((d, di) => {
							return <StakingTokenItem key={di} style={[SS.mr10, SS.mb10]} coin={d.token} />;
						})}
					</View>
				)}
			</View>
		</View>
	);
};

// Commencing && unstaking
const UnParticipate = ({ statedTokens, unStakeTokens, handleStaking, uncomingTokens }) => {
	const uList = uncomingTokens.filter((e) => !statedTokens.find((d) => d.eventId === e.eventId));
	return (
		<View style={[S.bg(ThemeVar.headerStyle), SS.p20, SS.pb10, SS.radius10]}>
			<Button block onPress={() => handleStaking([...unStakeTokens, ...uList], 1)}>
				<Text>{I18n.t('staking.stake')}</Text>
			</Button>
			<View>
				<Text style={[SS.pv15, SS.fw600, SS.fz14]}>{I18n.t('staking.airdrops')}</Text>
				<View style={[SS.row, SS.ac, SS.mb10, { flexWrap: 'wrap' }]}>
					{unStakeTokens.map((d, di) => {
						return <StakingTokenItem key={di} style={[SS.mr10, SS.mb10]} coin={d.token} />;
					})}
					<Text style={[SS.fz12, SS.cS]}>{I18n.t('staking.availableToStake')}</Text>
				</View>
				{uList.length > 0 && (
					<View style={[SS.row, SS.ac, SS.mb10, { flexWrap: 'wrap' }]}>
						{uList.map((d, di) => {
							return <StakingTokenItem key={di} style={[SS.mr10, SS.mb10]} coin={d.token} />;
						})}
						<Text style={[SS.fz12, SS.cS, SS.mb10]}>{I18n.t('staking.preStake')}</Text>
					</View>
				)}
			</View>
		</View>
	);
};

// Commencing && staked
const Staked = ({ statedTokens, unStakeTokens, uncomingTokens, statedAmount }) => {
	const handleStake = (tokens) => {
		Base.push('staking/add', { tokens, amount: statedAmount, type: 4 });
	};
	const uList = uncomingTokens.filter((e) => !statedTokens.find((d) => d.eventId === e.eventId));
	return (
		<View style={[S.bg(ThemeVar.headerStyle), SS.p20, SS.pb10, SS.radius10]}>
			<Text style={[SS.fw600, SS.fz24, SS.tc]}>{I18n.t('staking.title')}</Text>
			<View>
				<Text style={[SS.pv15, SS.fw600, SS.fz14]}>{I18n.t('staking.airdrops')}</Text>
				<View style={[SS.row, SS.ae, SS.jsb, SS.mb10, { flexWrap: 'wrap' }]}>
					<View style={[SS.flex1, SS.row, SS.ac, { flexWrap: 'wrap' }]}>
						{statedTokens.map((d, di) => {
							return <StakingTokenItem key={di} style={[SS.mr10, SS.mb10]} coin={d.token} />;
						})}
						<Text style={[SS.fz12, SS.cS, SS.mb10]}>{I18n.t('staking.title')}</Text>
					</View>
				</View>
				{unStakeTokens.length > 0 && (
					<View style={[SS.row, SS.ae, SS.jsb, SS.mb10, { flexWrap: 'wrap' }]}>
						<View style={[SS.flex1, SS.row, SS.ac, { flexWrap: 'wrap' }]}>
							{unStakeTokens.map((d, di) => {
								return <StakingTokenItem key={di} style={[SS.mr10, SS.mb10]} coin={d.token} />;
							})}
							<Text style={[SS.fz12, SS.cS, SS.mb10]}>{I18n.t('staking.available')}</Text>
						</View>
						<View style={[SS.mb5, SS.ml20]}>
							<Button onPress={() => handleStake(unStakeTokens)} rounded small>
								<Text style={[{ minWidth: 90 }, SS.tc]}>{I18n.t('staking.stake')}</Text>
							</Button>
						</View>
					</View>
				)}
				{uList.length > 0 && (
					<View style={[SS.row, SS.ae, SS.jsb, SS.mb10, { flexWrap: 'wrap' }]}>
						<View style={[SS.flex1, SS.row, SS.ac, { flexWrap: 'wrap' }]}>
							{uList.map((d, di) => {
								return <StakingTokenItem key={di} style={[SS.mr10, SS.mb10]} coin={d.token} />;
							})}
							<Text style={[SS.fz12, SS.cS, SS.mb10]}>{I18n.t('staking.soon')}</Text>
						</View>
						<View style={[SS.mb5, SS.ml20]}>
							<Button onPress={() => handleStake(uList)} rounded small>
								<Text style={[{ minWidth: 90 }, SS.tc]}>{I18n.t('staking.preStake')}</Text>
							</Button>
						</View>
					</View>
				)}
			</View>
		</View>
	);
};
// Ended
const Ended = ({ statedTokens, unStakeTokens }) => {
	return (
		<View style={[S.bg(ThemeVar.headerStyle), SS.p20, SS.pb10, SS.radius10]}>
			<Text style={[SS.fw600, SS.fz24, SS.tc]}>{` `}</Text>
			<View>
				<Text style={[SS.pv15, SS.fw600, SS.fz14]}>{I18n.t('staking.airdrops')}</Text>
				<View style={[SS.row, SS.ac, SS.jsb, SS.mb10]}>
					<View style={[SS.row, SS.ac, { flexWrap: 'wrap' }]}>
						{[...statedTokens, ...unStakeTokens].map((d, di) => {
							return <StakingTokenItem key={di} style={[SS.mr10, SS.mb10]} coin={d.token} />;
						})}
					</View>
				</View>
			</View>
		</View>
	);
};
export const StatusCon = () => {
	const [{ filter, rewards }] = useStore('staking.config');
	//status: 0-》Ended  1-》Upcoming ，2-》Commencing
	const [eventInfo, setEventInfo] = useGetParticipationEvents();
	let { status = 0, list = [], upcomingList = [], commencingList = [], endedList = [] } = eventInfo;
	let [statedTokens] = useStore('staking.statedTokens');
	const [statedAmount] = useStore('staking.statedAmount');
	const [assetsList] = useStore('common.assetsList');
	const assets = assetsList.find((e) => e.name === 'IOTA') || {};
	if (statedTokens.length > 0) {
		status = 3;
	}
	list = list.filter((e) => !filter.includes(e.id));
	const startTime = upcomingList[upcomingList.length - 1]?.startTime;
	const commenceTime = upcomingList[upcomingList.length - 1]?.commenceTime;
	useEffect(() => {
		let timeHandle = null;
		if (eventInfo.status === 1) {
			timeHandle = setInterval(() => {
				if (startTime <= new Date().getTime() / 1000) {
					setEventInfo({ ...eventInfo, status: 2 });
				}
			}, 5000);
		}
		return () => {
			timeHandle && clearInterval(timeHandle);
		};
	}, [startTime, eventInfo]);
	const unStakeTokens = [];
	const uncomingTokens = upcomingList.map((e) => {
		const token = e.payload.symbol;
		let unit = _get(rewards, `${token}.unit`) || token;
		return {
			token: unit,
			eventId: e.id,
			status: 'uncoming',
			limit: e.limit
		};
	});
	statedTokens = statedTokens.map((e) => {
		const token = e.token;
		let unit = _get(rewards, `${token}.unit`) || token;
		return { ...e, token: unit, status: endedList.find((a) => a.id === e.eventId) ? 'ended' : '' };
	});
	list.forEach((e) => {
		const token = e.payload.symbol;
		const tokenInfo = statedTokens.find((d) => d.eventId === e.id);
		const commencingInfo = commencingList.find((a) => a.id === e.id);
		if (!tokenInfo && commencingInfo) {
			let unit = _get(rewards, `${token}.unit`) || token;
			unStakeTokens.push({
				token: unit,
				eventId: e.id,
				status: 'unstake',
				limit: e.limit
			});
		}
	});
	let available = parseFloat(assets.balance - statedAmount) || 0;
	if (available < 0) {
		available = 0;
	}

	const handleStaking = (tokens, type) => {
		if (available < 1) {
			return Toast.error(I18n.t('staking.noAvailableTips'));
		}
		Base.push('staking/add', { tokens, type });
	};
	const handleUnstake = () => {
		Base.push('staking/add', { tokens: statedTokens, type: 3 });
	};

	let AirdropsItem = [Ended, Upcoming, UnParticipate, Staked][eventInfo.status || 0];

	const unEndedStakeTokens = statedTokens.filter((e) => e.status !== 'ended');
	let amountList = [
		{
			token: 'IOTA',
			amount: available,
			statusStr: I18n.t('staking.available'),
			borderColor: '#d0d1d2',
			btnDis:
				eventInfo.status == 0 || unEndedStakeTokens.length == 0 || dayjs(commenceTime * 1000).isAfter(dayjs()) // end
		}
	];
	if (status === 3) {
		amountList[0].btnStr = I18n.t('staking.add');
		amountList[0].onPress = () => {
			handleStaking(unEndedStakeTokens, 2);
		};
		amountList.push({
			token: 'IOTA',
			btnDis: statedAmount <= 0,
			amount: statedAmount,
			statusStr: I18n.t('staking.staked'),
			btnStr: I18n.t('staking.unstake'),
			onPress: handleUnstake,
			borderColor: '#e2e4e4'
		});
	}

	const handleHis = () => {
		Base.push('staking/history');
	};
	return (
		<View style={[S.bg(ThemeVar.contentStyle), SS.radius10]}>
			<View style={[SS.row, SS.je]}>
				<View style={[SS.row, SS.ac, SS.p15]}>
					<Text style={[SS.fz14, SS.mr10]}>{I18n.t('staking.his')}</Text>
					<SvgIcon onPress={handleHis} name='history' size={20} />
				</View>
			</View>
			<AirdropsItem
				uncomingTokens={uncomingTokens}
				statedTokens={statedTokens}
				handleStaking={handleStaking}
				unStakeTokens={unStakeTokens}
				startTime={startTime}
				statedAmount={statedAmount}
				commenceTime={commenceTime}
			/>
			<AmountCon amountList={amountList} />
		</View>
	);
};

export const RewardsList = () => {
	const [curWallet] = useGetNodeWallet();
	const [statedTokens] = useStore('staking.statedTokens');
	const stakedRewards = useGetRewards(curWallet);
	const [{ rewards }] = useStore('staking.config');
	const list = statedTokens.map((e) => {
		const { token, eventId } = e;
		const ratio = _get(rewards, `${token}.ratio`) || 0;
		let unit = _get(rewards, `${token}.unit`) || token;
		let total = _get(stakedRewards, `${eventId}.amount`) * ratio || 0;
		// 1 = 1000m = 1000000u
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
		return {
			token,
			label: `${Base.formatNum(total)}${preUnit} ${unit}`
		};
	});
	if (list.length <= 0) {
		return null;
	}
	return (
		<View style={[SS.mt25]}>
			<Text style={[SS.cS, SS.fz16]}>{I18n.t('staking.estimatedReceived')}</Text>
			<View style={[SS.row, SS.pv10, { flexWrap: 'wrap' }]}>
				{list.map((e, i) => {
					return <StakingTokenItem key={i} style={[SS.mr10, SS.mb10]} coin={e.token} label={e.label} />;
				})}
			</View>
		</View>
	);
};

export const AirdopsList = () => {
	const [{ airdrops }] = useStore('staking.config');
	if (airdrops.length === 0) {
		return null;
	}
	return (
		<View style={[SS.mt15]}>
			<Text style={[SS.cS, SS.fz16, SS.mb10]}>{I18n.t('staking.airdropsList')}</Text>
			{airdrops.map((e, i) => {
				return (
					<TouchableOpacity
						key={i}
						style={[SS.mb10, SS.bgS, S.radius(8), SS.row, SS.jsb, SS.ac, SS.p10]}
						onPress={() => {
							Base.push(e.link, { title: e.token });
						}}
						activeOpacity={0.8}>
						<View style={[SS.row, SS.ac]}>
							<Image style={[S.wh(24), SS.mr10]} source={{ uri: Base.getIcon(e.token) }} />
							<Text style={[SS.fz12]}>{e.desc}</Text>
						</View>
						<SvgIcon name='right' size={14} />
					</TouchableOpacity>
				);
			})}
		</View>
	);
};
