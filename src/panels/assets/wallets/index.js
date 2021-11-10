import React, { useEffect, useRef, useState } from 'react';
import { Container, Content, View, Text, Button } from 'native-base';
import { StyleSheet, InteractionManager, TouchableOpacity } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { Base, Nav1, I18n, S, SS, images, ThemeVar, Toast, Icon, NoData } from '@/common';
import { AddDialog } from './addDialog';
import { useSelectWallet, useGetNodeWallet } from '@/store/common';

export const AssetsWallets = () => {
	const dialogRef = useRef();
	const selectWallet = useSelectWallet();
	const [_, walletsList] = useGetNodeWallet();
	const [curActive, setActive] = useState('');
	useEffect(() => {
		const id = (walletsList.find((e) => e.isSelected) || {}).id;
		setActive(id || '');
	}, [walletsList]);
	return (
		<Container>
			<Nav1 title={I18n.t('assets.myWallets')} />
			<Content contentContainerStyle={[SS.ph20]}>
				{walletsList.length > 0 ? (
					<View style={[SS.mb20]}>
						{walletsList.map((e) => {
							const isActive = curActive === e.id;
							return (
								<TouchableOpacity
									activeOpacity={0.8}
									onPress={() => {
										if (curActive === e.id) {
											Base.goBack();
											return;
										}
										setActive(e.id);
										Toast.showLoading();
										setTimeout(() => {
											selectWallet(e.id);
										}, 20);
										Base.goBack();
										setTimeout(() => {
											Toast.hideLoading();
										}, 100);
									}}
									key={e.id}
									style={[
										isActive ? S.bg('#1D70F7') : S.border(4, '#000', 1),
										SS.radius10,
										SS.ph20,
										SS.pv15,
										SS.mt20
									]}>
									<Text style={[SS.fz17, isActive && SS.cW]}>{e.name}</Text>
									<View style={[SS.mt20, SS.row, SS.ae]}>
										<Text style={[isActive && SS.cW, SS.fz15]}>
											{Base.handleAddress(e.address)}
										</Text>
										<Icon
											onPress={() => {
												Clipboard.setString(e.address);
												Toast.success(I18n.t('assets.copied'));
											}}
											style={[S.wh(20), SS.ml30]}
											name={isActive ? images.com.copy1 : images.com.copy}
										/>
									</View>
								</TouchableOpacity>
							);
						})}
					</View>
				) : (
					<NoData />
				)}
			</Content>
			<View style={[SS.pv10, S.border(0)]}>
				<Button
					block
					transparent
					onPress={() => {
						dialogRef.current.show();
					}}>
					<Text style={[S.color(ThemeVar.textColor)]}>+　{I18n.t('assets.addWallets')}</Text>
				</Button>
			</View>
			<AddDialog dialogRef={dialogRef} />
		</Container>
	);
};

const styles = StyleSheet.create({});
