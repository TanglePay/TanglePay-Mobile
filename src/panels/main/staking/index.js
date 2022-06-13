import React from 'react';
import { Container, Content, Spinner, View } from 'native-base';
import { Nav, S, SS, ThemeVar } from '@/common';
import { StatusCon, AirdopsList } from './widget';
import { useGetEventsConfig } from '@tangle-pay/store/staking';
import { useStore } from '@tangle-pay/store';
import { I18n } from '@tangle-pay/common';
export const Staking = () => {
	useGetEventsConfig();
	const [isRequestStakeHis] = useStore('common.isRequestStakeHis');
	return (
		<Container>
			<Nav title={I18n.t('staking.title')} />
			<Content contentContainerStyle={[SS.ph20]}>
				<StatusCon />
				<AirdopsList />
			</Content>
			{!isRequestStakeHis && (
				<View style={[SS.c, S.wh(ThemeVar.deviceWidth, ThemeVar.deviceHeight), SS.pa, { left: 0, top: 0 }]}>
					<Spinner color='gray' />
				</View>
			)}
		</Container>
	);
};
