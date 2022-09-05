import React, { useEffect } from 'react';
import { Container, Content, Spinner, View } from 'native-base';
import { Nav, S, SS, ThemeVar, Toast } from '@/common';
import { StatusCon, AirdopsList } from './widget';
import { useGetEventsConfig } from '@tangle-pay/store/staking';
import { useStore } from '@tangle-pay/store';
import { I18n } from '@tangle-pay/common';
import { useGetNodeWallet, useGetAssetsList } from '@tangle-pay/store/common';

export const Staking = () => {
	const [curWallet] = useGetNodeWallet();
	useGetAssetsList(curWallet);
	useGetEventsConfig();
	const [isRequestStakeHis] = useStore('common.isRequestStakeHis');
	useEffect(() => {
		isRequestStakeHis ? Toast.hideLoading() : Toast.showLoading();
	}, [isRequestStakeHis]);
	return (
		<Container>
			<Nav title={I18n.t('staking.title')} />
			<Content contentContainerStyle={[SS.ph15, SS.pt15]}>
				<StatusCon />
				<AirdopsList />
			</Content>
			{/* {!isRequestStakeHis && (
				<View style={[SS.c, S.wh(ThemeVar.deviceWidth, ThemeVar.deviceHeight), SS.pa, { left: 0, top: 0 }]}>
					<Spinner color='gray' />
				</View>
			)} */}
		</Container>
	);
};
