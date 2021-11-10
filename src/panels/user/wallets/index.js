import React from 'react';
import { Container, Content, View, Text } from 'native-base';
import { TouchableOpacity, Image } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { Base, Nav, S, SS, I18n, images, Toast, Icon } from '@/common';
import { useGetNodeWallet } from '@/store/common';
// import {useStore} from '@/store'

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
										<Text style={[SS.fz15]}>{Base.handleAddress(e.address)}</Text>
										<Icon
											onPress={() => {
												Clipboard.setString(e.address);
												Toast.success(I18n.t('assets.copied'));
											}}
											style={[S.wh(20), SS.ml30]}
											name={images.com.copy}
										/>
									</View>
								</View>
								<View>
									<Image style={[S.wh(16)]} source={images.com.right} />
								</View>
							</TouchableOpacity>
						);
					})}
				</View>
			</Content>
		</Container>
	);
};
