import React from 'react';
import { Container, Content, View, Text } from 'native-base';
import { I18n } from '@tangle-pay/common';
import { List } from './list';
import { SS, Nav } from '@/common';

export const StakingHistory = () => {
	return (
		<Container>
			<Nav title={I18n.t('staking.his')} />
			<Content style={[SS.pt10]}>
				<List />
			</Content>
		</Container>
	);
};
