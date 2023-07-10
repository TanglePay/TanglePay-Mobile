import React, { useEffect, useRef, useState } from 'react';
import { Container, Content, View, Text, Button, Image } from 'native-base';
import { TouchableOpacity } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { Base, I18n, IotaSDK } from '@tangle-pay/common';
import { AddDialog } from './addDialog';
import { useRoute } from '@react-navigation/native';
import { useStore } from '@tangle-pay/store';
import { useSelectWallet, useGetNodeWallet } from '@tangle-pay/store/common';
import { S, SS, SvgIcon, Nav, ThemeVar, NoData, Toast } from '@/common';
import Shadow from '@/common/components/Shadow';

export const AssetsWallets = () => {
	const dialogRef = useRef();
	const selectWallet = useSelectWallet();
	let [_, walletsList] = useGetNodeWallet();
	walletsList = walletsList.filter((e) => !e.isHideTest);
	const [curActive, setActive] = useState('');
	const [isPwdInput, setIsPwdInput] = useStore('common.pwdInput');
	const { params } = useRoute();
	if (params?.nodeId) {
		walletsList = walletsList.filter((e) => e.nodeId == params.nodeId);
	}
	useEffect(() => {
		const id = (walletsList.find((e) => e.isSelected) || {}).id;
		setActive(id || '');
	}, [walletsList]);
	return (
		<Container>
			<Nav title={I18n.t('assets.myWallets')} headerStyle={{ borderBottomWidth: ThemeVar.borderWidth }} />
			<Content contentContainerStyle={[SS.ph16]}>
				{walletsList.length > 0 ? (
					<View style={[SS.mb16]}>
						{walletsList.map((e) => {
							const isActive = curActive === e.id;
							const curNode = IotaSDK.nodes.find((d) => d.id == e.nodeId) || {};
							return (
								<TouchableOpacity
									activeOpacity={0.8}
									onPress={() => {
										if (curActive === e.id) {
											Base.goBack();
											return;
										}
										setActive(e.id);
										setIsPwdInput(false);
										// Toast.showLoading();
										setTimeout(() => {
											selectWallet(e.id);
										}, 20);
										Base.goBack();
										// setTimeout(() => {
										// 	Toast.hideLoading();
										// }, 100);
									}}
									key={e.id}
									style={[
										isActive ? S.bg(ThemeVar.brandPrimary) : S.border(4, '#000', 1),
										SS.radius8,
										SS.ph16,
										SS.pv12,
										SS.mt16
									]}>
									<View style={[SS.row, SS.ac, SS.jsb]}>
										<Text style={[SS.fz16, SS.fw600, isActive && SS.cW]}>{e.name}</Text>
										<Text style={[SS.fz14, SS.cS, isActive && SS.cW]}>
											{curNode?.type == 2 ? 'EVM' : curNode?.name}
										</Text>
									</View>
									<View style={[SS.mt5, SS.row, SS.ae]}>
										<Text style={[isActive && SS.cW, SS.fz14, { minWidth: 85 }]}>
											{Base.handleAddress(e.address)}
										</Text>
										<SvgIcon
											onPress={() => {
												Clipboard.setString(e.address);
												Toast.success(I18n.t('assets.copied'));
											}}
											name='copy'
											size={16}
											color={isActive ? '#fff' : ThemeVar.textColor}
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
			<Shadow>
				<TouchableOpacity
					activeOpacity={0.8}
					style={[{ height: 70 }, SS.c]}
					onPress={() => {
						dialogRef.current.show();
					}}>
					<Text style={[SS.cP, SS.fz16, SS.fw600, SS.mb10]}>+　{I18n.t('assets.addWallets')}</Text>
				</TouchableOpacity>
			</Shadow>
			<AddDialog dialogRef={dialogRef} nodeId={params?.nodeId} />
		</Container>
	);
};
