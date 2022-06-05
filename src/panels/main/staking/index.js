import React from 'react';
import { Container, Content, Spinner, View } from 'native-base';
import { AssetsNav, S, SS, ThemeVar } from '@/common';
import { StatusCon, AirdopsList } from './widget';
import { useGetEventsConfig } from '@tangle-pay/store/staking';
import { useStore } from '@tangle-pay/store';
export const Staking = () => {
	useGetEventsConfig();
	const [isRequestStakeHis] = useStore('common.isRequestStakeHis');
	return (
		<Container>
			<AssetsNav />
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
