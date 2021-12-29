import React from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Header, Left, Right, Text } from 'native-base';
import { Base, I18n } from '@tangle-pay/common';
import { useGetNodeWallet } from '@tangle-pay/store/common';
import Clipboard from '@react-native-clipboard/clipboard';
import { S, SS } from '@/common/style/base.style';
import { Toast } from './Toast';
import { SvgIcon } from '@/common/assets';

export const AssetsNav = ({ right }) => {
	const [curWallet] = useGetNodeWallet();
	return (
		<Header transparent style={{ borderBottomWidth: 0 }}>
			<Left>
				<View style={[SS.row, SS.ac, SS.pl15]}>
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => {
							Base.push('assets/wallets');
						}}
						style={[SS.row, SS.ac, S.bg('#1D70F7'), S.radius(20), SS.ph10, SS.pv5]}>
						<Text numberOfLines={1} ellipsizeMode='tail' style={[SS.fz16, SS.cW, { maxWidth: 120 }]}>
							{curWallet.name || I18n.t('assets.addWallets')}
						</Text>
						<SvgIcon size={12} style={[SS.ml10]} name='right' color='#ffffff' />
					</TouchableOpacity>
					{curWallet.address && (
						<Text
							onLongPress={() => {
								Clipboard.setString(curWallet.address);
								Toast.success(I18n.t('assets.copied'));
							}}
							style={[SS.cS, SS.fz14, SS.ml10]}>
							{Base.handleAddress(curWallet.address)}
						</Text>
					)}
				</View>
			</Left>
			{right && <Right>{right}</Right>}
		</Header>
	);
};
