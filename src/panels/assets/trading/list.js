import React, { useState } from 'react';
import { useStore } from '@tangle-pay/store';
import { useHandleUnlocalConditions } from '@tangle-pay/store/common';
import { Container, Content, View, Text, SwipeRow, Image } from 'native-base';
import { Base, I18n } from '@tangle-pay/common';
import { S, SS, Nav, SvgIcon, NoData } from '@/common';

const Item = (item) => {
	const { onDismiss } = useHandleUnlocalConditions();
	const [opacity, setOpacity] = useState(1);
	return (
		<View style={[S.border(2)]}>
			<View style={{ height: 72 }} className='w100 flex ac row'>
				<View style={[SS.c, SS.pr, { height: 72, width: 80 }]}>
					<Image
						style={[
							S.wh(32),
							S.radius(32),
							SS.pa,
							SS.bgW,
							{ left: 24, top: 20, zIndex: 1, opacity },
							S.border(4)
						]}
						source={{ uri: e.logoUrl }}
						onError={() => {
							setOpacity(0);
						}}
					/>
					<View style={[{ width: 32, height: 32, borderRadius: 32 }, S.border(4), SS.bgP, SS.c]}>
						<Text style={[SS.fw600, SS.cW, SS.fz22]}>{String(item.token).toLocaleUpperCase()[0]}</Text>
					</View>
				</View>
				<View style={[{ height: 72 }, SS.ac, SS.flex1, S.border(2)]}>
					<View style={{ width: 100 }}>
						<Text style={[SS.cP, SS.fz14, SS.fw600]}>
							{item.token}: {item.amountStr}
						</Text>
					</View>
					<View style={{ width: 130 }}>
						<View>
							<Text numberOfLines={1} style={[SS.fz14, SS.fw400, SS.mb4, { width: 130 }]}>
								{item.blockId}
							</Text>
						</View>
						<View>
							<Text numberOfLines={1} style={[SS.fz14, SS.fw400, { width: 130 }]}>
								{I18n.t('assets.tradingFrom')} {Base.handleAddress(item.unlockAddress)}
							</Text>
						</View>
					</View>
				</View>
			</View>
			<View style={[SS.w100, SS.ac, SS.row, SS.jsb, SS.pr24, { height: 60 }]}>
				<View style={[SS.ac, SS.row]}>
					<View style={[SS.c, { width: 80 }]}>
						<SvgIcon size='24' style={{ width: 24, height: 24 }} name='tradingTime' />
					</View>
					<View style={[SS.fz14, SS.fw400]}>{item.timeStr}</View>
				</View>
				<SvgIcon
					// onPress={(e) => toggleDom(e, true)}
					className='cP press add-icon'
					style={{ width: 24, height: 24 }}
					size='24'
					name='add'
				/>
				{/* <View className='flex ac adm-swipe-action-actions' style={{ right: -180, position: 'absolute' }}>
					<Button
						color='default'
						onClick={() => {
							Dialog.confirm({
								content: I18n.t('assets.dismissTips'),
								cancelText: I18n.t('apps.cancel'),
								confirmText: I18n.t('apps.execute'),
								onConfirm: () => {
									onDismiss(item.blockId);
								}
							});
						}}>
						{I18n.t('shimmer.dismiss')}
					</Button>
					<Button
						color='primary'
						onClick={() => {
							Base.push('/assets/trading', {
								id: item.blockId
							});
						}}>
						{I18n.t('shimmer.accept')}
					</Button>
				</View> */}
			</View>
		</View>
	);
};

export const AssetsTradingList = () => {
	const [unlockConditions] = useStore('common.unlockConditions');
	return (
		<Container>
			<Nav title={I18n.t('staking.tradingList')} />
			<Content style={[SS.pt10]}>
				{unlockConditions.length > 0 ? (
					<View>
						{unlockConditions.map((e, i) => {
							return <Item {...e} key={e.blockId} i={i} />;
						})}
					</View>
				) : (
					<NoData />
				)}
			</Content>
		</Container>
	);
};
