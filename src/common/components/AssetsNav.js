import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Header, Left, Right, Text } from 'native-base';
import { Base, I18n, IotaSDK } from '@tangle-pay/common';
import { useGetNodeWallet, useChangeNode } from '@tangle-pay/store/common';
import Clipboard from '@react-native-clipboard/clipboard';
import { S, SS } from '@/common/style/base.style';
import { Toast } from './Toast';
import { SvgIcon } from '@/common/assets';
import Modal from 'react-native-modal';
import { ThemeVar } from '../style/theme';

export const AssetsNav = ({ right, hasChangeNode, hasViewExplorer, hasScan }) => {
	const [curWallet] = useGetNodeWallet();
	const nodeId = curWallet?.nodeId;
	const curNode = IotaSDK.nodes.find((e) => e.id == nodeId) || {};
	const isWeb3 = IotaSDK.checkWeb3Node(nodeId);
	const web3Nodes = IotaSDK.nodes.filter((e) => IotaSDK.checkWeb3Node(e.id));
	const [isOpenChange, setOpenChange] = useState(false);
	const [isOpenMore, setOpenMore] = useState(false);
	const changeNode = useChangeNode();
	const hideModal = () => {
		setOpenChange(false);
		setOpenMore(false);
	};
	return (
		<>
			<Header transparent style={{ borderBottomWidth: 0 }}>
				<Left style={[SS.row, SS.ac]}>
					<View style={[SS.row, SS.ac, SS.pl10]}>
						<TouchableOpacity
							activeOpacity={0.8}
							onPress={() => {
								Base.push('assets/wallets');
							}}
							style={[SS.row, SS.ac, S.bg('#1D70F7'), S.radius(20), SS.ph10, SS.pv5, { maxWidth: 200 }]}>
							<Text
								numberOfLines={1}
								ellipsizeMode='tail'
								style={[SS.fz16, SS.cW, SS.fw600, { maxWidth: 80 }]}>
								{curWallet.name || I18n.t('assets.addWallets')}
							</Text>
							{curWallet.address && (
								<Text
									// onLongPress={() => {
									// 	Clipboard.setString(curWallet.address);
									// 	Toast.success(I18n.t('assets.copied'));
									// }}
									style={[SS.cW, SS.fz14, SS.fw300, SS.ml10]}>
									{Base.handleAddress(curWallet.address)}
								</Text>
							)}
							<SvgIcon size={12} style={[SS.ml10]} name='right' color='#ffffff' />
						</TouchableOpacity>
					</View>
					{isWeb3 && hasChangeNode && (
						<TouchableOpacity
							activeOpacity={0.8}
							onPress={() => setOpenChange(!isOpenChange)}
							style={[
								SS.ml10,
								S.border(4),
								SS.ph10,
								SS.row,
								SS.ac,
								{ borderRadius: 20, height: 30, lineHeight: 30 }
							]}>
							<Text
								numberOfLines={1}
								ellipsizeMode='tail'
								style={[SS.fz14, SS.fw500, SS.mr10, { maxWidth: 85 }]}>
								{curNode?.name}
							</Text>
							<SvgIcon
								style={{
									// marginBottom: isOpenChange ? -2 : 2,
									// transform: isOpenChange ? [{ rotate: '180deg' }] : []
									transform: [{ rotate: '180deg' }]
								}}
								name='up'
								color='black'
								size='11'
							/>
						</TouchableOpacity>
					)}
				</Left>
				{curWallet.address && (hasScan || hasViewExplorer) && (
					<Right style={{ flex: undefined }}>
						<SvgIcon
							onPress={() => {
								setOpenMore(!isOpenMore);
							}}
							name='more'
							size={30}
							style={[SS.ac, SS.je, SS.mr4]}
						/>
					</Right>
				)}
			</Header>
			{(isOpenChange || isOpenMore) && (
				<Modal
					animationIn='fadeIn'
					hasBackdrop
					backdropOpacity={0.1}
					onBackButtonPress={hideModal}
					onBackdropPress={hideModal}
					isVisible={isOpenChange || isOpenMore}>
					{isOpenChange && (
						<View
							style={{
								position: 'absolute',
								backgroundColor: '#fff',
								top:
									ThemeVar.toolbarHeight -
									(ThemeVar.platform === 'ios' ? 0 : ThemeVar.Inset.portrait.topInset),
								left: -2,
								shadowColor: '#000',
								shadowOffset: { width: 0, height: 2 },
								shadowOpacity: 0.1,
								shadowRadius: 1.5,
								elevation: 3,
								// boxShadow: '-10px 24px 48px rgba(0, 0, 0, 0.24)',
								borderRadius: 8
							}}>
							<View style={[SS.c, S.border(2), { height: 44, minWidth: 260 }]}>
								<Text style={[SS.fz14]}>{I18n.t('user.network')}</Text>
							</View>
							{web3Nodes.map((e) => {
								return (
									<TouchableOpacity
										key={e.id}
										activeOpacity={0.8}
										onPress={() => {
											setOpenChange(false);
											changeNode(e.id);
										}}
										style={[SS.ac, SS.js, SS.row, SS.pl15, { height: 44, minWidth: 260 }]}>
										<View style={{ width: 30 }}>
											{nodeId == e.id && <SvgIcon name='tick' color='#5BB3AE' size='20' />}
										</View>
										<View
											style={{
												width: 12,
												height: 12,
												borderRadius: 12,
												backgroundColor: '#5BB3AE'
											}}></View>
										<Text style={[SS.fz14, SS.fw500, SS.mh10]}>{e.name}</Text>
									</TouchableOpacity>
								);
							})}
						</View>
					)}
					{isOpenMore && (
						<View
							style={{
								position: 'absolute',
								backgroundColor: '#fff',
								top:
									ThemeVar.toolbarHeight -
									(ThemeVar.platform === 'ios' ? 0 : ThemeVar.Inset.portrait.topInset),
								right: -2,
								shadowColor: '#000',
								shadowOffset: { width: 0, height: 2 },
								shadowOpacity: 0.1,
								shadowRadius: 1.5,
								elevation: 3,
								// boxShadow: '-10px 24px 48px rgba(0, 0, 0, 0.24)',
								borderRadius: 8,
								paddingVertical: 10
							}}>
							{hasViewExplorer && (
								<TouchableOpacity
									activeOpacity={0.8}
									onPress={() => {
										hideModal();
										Base.push(
											`${curNode.explorer}/${
												IotaSDK.checkSMR(curWallet.nodeId) ? 'addr' : 'address'
											}/${curWallet.address}`
										);
									}}
									style={[SS.row, SS.ac, SS.ph15, { height: 44, minWidth: 260 }]}>
									<SvgIcon name='view' color='black' size='20' />
									<View style={[SS.ml10]}>
										<Text style={[SS.fz14, SS.fw500]}>{I18n.t('account.viewInExplorer')}</Text>
									</View>
								</TouchableOpacity>
							)}
							{hasScan && (
								<TouchableOpacity
									activeOpacity={0.8}
									onPress={() => {
										hideModal();
										Base.push(`assets/scan`);
									}}
									style={[
										SS.row,
										SS.ac,
										SS.mh15,
										{ height: 44, minWidth: 260 },
										S.border(0, '#eee', 1)
									]}>
									<SvgIcon name='scan' color='black' size='20' />
									<View style={[SS.ml10]}>
										<Text style={[SS.fz14, SS.fw500]}>{I18n.t('assets.scanTitle')}</Text>
									</View>
								</TouchableOpacity>
							)}
						</View>
					)}
				</Modal>
			)}
		</>
	);
};
