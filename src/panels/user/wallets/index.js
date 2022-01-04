import React from 'react';
import { Container, Content, View, Text } from 'native-base';
import { TouchableOpacity } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { Base, I18n } from '@tangle-pay/common';
import { useGetNodeWallet } from '@tangle-pay/store/common';
import { Nav, S, SS, SvgIcon, Toast } from '@/common';

export const UserWallets = () => {
	const [_, walletsList] = useGetNodeWallet();
	return (
		<Container>
			<Nav title={I18n.t('user.manageWallets')} />
			<Content>
				<View style={[SS.ph20]}>
					{walletsList.map((e) => {
						return (
							<TouchableOpacity
								style={[
									SS.ac,
									SS.jsb,
									SS.row,
									S.border(4, '#000', 1),
									SS.radius10,
									SS.ph20,
									SS.pv15,
									SS.mt20
								]}
								activeOpacity={0.8}
								onPress={() => {
									// setEidtWallet(e.id),
									Base.push('user/editWallet', { id: e.id });
								}}
								key={e.id}>
								<View>
									<Text style={[SS.fz17]}>{e.name}</Text>
									<View style={[SS.mt20, SS.row, SS.ae]}>
										<Text style={[SS.fz13]}>{Base.handleAddress(e.address)}</Text>
										<SvgIcon
											onPress={() => {
												Clipboard.setString(e.address);
												Toast.success(I18n.t('assets.copied'));
											}}
											name='copy'
											size={20}
											style={[SS.ml30]}
										/>
									</View>
								</View>
								<SvgIcon size={14} name='right' />
							</TouchableOpacity>
						);
					})}
				</View>
			</Content>
		</Container>
	);
};
