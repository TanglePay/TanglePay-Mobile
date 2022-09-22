import React, { useRef } from 'react';
import { Container, Content, View, Text, Button } from 'native-base';
import { I18n, Base } from '@tangle-pay/common';
import { TipsDialog } from './tipsDialog';
import { SS, S, Nav, SvgIcon, ThemeVar } from '@/common';

export const AccountBackup = () => {
	const dialogRef = useRef();
	const handleNext = () => {
		// dialogRef.current.show();
		Base.push('account/mnemonic');
	};
	return (
		<Container>
			<Nav title={I18n.t('account.backupTitle')} />
			<Content>
				<View style={[SS.c, SS.pt75, SS.pb55]}>
					<SvgIcon size={88} name='encrypt' />
				</View>
				<View style={[SS.ph24, SS.pb30]}>
					<View style={[SS.mb30]}>
						<Text style={[SS.fz16, SS.fw600, SS.cP]}>{I18n.t('account.backupTips')}</Text>
					</View>
					<View style={[S.marginB(80)]}>
						<Text style={[SS.fz14, S.lineHeight(20)]}>{I18n.t('account.backupTipsContent')}</Text>
					</View>
					<Button block onPress={handleNext}>
						<Text>{I18n.t('account.next')}</Text>
					</Button>
				</View>
			</Content>
			<TipsDialog dialogRef={dialogRef} />
		</Container>
	);
};
