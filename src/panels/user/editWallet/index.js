import React, { useRef, useEffect, useState } from 'react';
import { Container, Content, View, Text, Switch } from 'native-base';
import { TouchableOpacity } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { Base, I18n, IotaSDK } from '@tangle-pay/common';
import { NameDialog } from './nameDialog';
import { EnablePasswordDialog } from './enablePasswordDialog';
import { DisablePasswordDialog } from './disablePasswordDialog';
import { useGetNodeWallet } from '@tangle-pay/store/common';
import { Nav, S, SS, ThemeVar, SvgIcon, Toast } from '@/common';
import { checkWalletIsPasswordEnabled, context } from '@tangle-pay/domain';

export const UserEditWallet = () => {
	// const { params } = useRoute();
	const [curEdit] = useGetNodeWallet();
	const id = curEdit.id;
	// const [_, walletsList] = useGetNodeWallet();
	// const curEdit = walletsList.find((e) => e.id === id) || {};
	const [passwordEnabled, setPasswordEnabled] = useState(false);
	const enableDialogRef = useRef();
	const disableDialogRef = useRef();
	const name = curEdit.name || '';
	const dialogRef = useRef();
	const curNode = IotaSDK.nodes.find((d) => d.id == curEdit.nodeId);
	const isLedger = curEdit.type == 'ledger';
	const syncIsPasswordEnabled = async () => {
		const res = await checkWalletIsPasswordEnabled(curEdit.id);
		setPasswordEnabled(res);
	};
	useEffect(() => {
		console.log('curEdit', curEdit);
		syncIsPasswordEnabled().catch((e) => console.log(e));
	}, []);
	return (
		<Container>
			<Nav title={I18n.t('user.manage')} />
			<Content>
				<View style={[SS.row, SS.pv20, SS.ph16, SS.ac, S.border(2)]}>
					<View style={[SS.c, S.wh(40), S.radius(40), SS.mr16, S.bg(ThemeVar.brandPrimary)]}>
						<Text style={[SS.cW, SS.fz15]}>{name[0] || ''}</Text>
					</View>
					<View>
						<View style={[SS.ac, SS.row, SS.mb10]}>
							<Text style={[SS.fz14, SS.mr10, SS.fw600]}>{name}</Text>
							<SvgIcon
								onPress={() => {
									dialogRef.current.show();
								}}
								name='edit'
								size={20}
							/>
						</View>
						<View style={[S.w(ThemeVar.deviceWidth - 120)]}>
							<Text style={[SS.fz14, SS.cS, { lineHeight: 24 }]}>{curEdit.address}</Text>
							<SvgIcon
								onPress={() => {
									Clipboard.setString(curEdit.address);
									Toast.success(I18n.t('assets.copied'));
								}}
								name='copy'
								size={20}
								style={[SS.pa, { right: -20, top: 3 }]}
							/>
						</View>
						{/* <View style={[SS.row, SS.ac, SS.mt10]}>
							<View style={[S.radius(10), S.wh(10, 10), S.bg('#4E9B45')]}></View>
							<Text style={[SS.fz14, SS.ml5]}>
								{IotaSDK.nodes.find((e) => e.id == curEdit.nodeId)?.name}
							</Text>
						</View> */}
					</View>
				</View>
				{/* <TouchableOpacity
					onPress={() => {
						Base.push('user/backupWallet');
					}}
					activeOpacity={0.8}
					style={[SS.p20, SS.row, SS.jsb, SS.ac, S.border(2)]}>
					<Text style={[SS.fz14]}>{I18n.t('user.backupWallet')}</Text>
					<Icon style={[S.wh(16)]} name={images.com.right} />
				</TouchableOpacity> */}
				{curNode?.type == 1 ? (
					<TouchableOpacity
						onPress={() => {
							Base.push('user/walletDetail');
						}}
						activeOpacity={0.8}
						style={[SS.ph16, SS.pv20, SS.row, SS.jsb, SS.ac, S.border(2)]}>
						<Text style={[SS.fz14]}>{I18n.t('account.walletDetail')}</Text>
						<SvgIcon size={16} name='right' />
					</TouchableOpacity>
				) : null}
				{!isLedger ? (
					<View activeOpacity={0.8} style={[SS.p16, S.border(2), SS.row, SS.ac, SS.jsb]}>
						<Text style={[SS.fz14]}>{I18n.t('account.toggleWalletPassword')}</Text>
						<Switch
							value={passwordEnabled}
							onValueChange={async (e) => {
								if (e) {
									enableDialogRef.current.show(syncIsPasswordEnabled);
								} else {
									if (context.state.isPinSet) {
										disableDialogRef.current.show(syncIsPasswordEnabled);
									} else {
										Toast.error(I18n.t('account.needPinToTurnoffPassword'));
									}
								}
							}}
						/>
					</View>
				) : null}
				{curNode?.type == 2 && !isLedger ? (
					<TouchableOpacity
						onPress={() => {
							Base.push('user/privateKey', {
								...curEdit
							});
						}}
						activeOpacity={0.8}
						style={[SS.ph16, SS.pv20, SS.row, SS.jsb, SS.ac, S.border(2)]}>
						<Text style={[SS.fz14]}>{I18n.t('account.exportKey')}</Text>
						<SvgIcon size={16} name='right' />
					</TouchableOpacity>
				) : null}
				{curEdit?.mnemonic ? (
					<TouchableOpacity
						onPress={() => {
							Base.push('user/exportMnemonic', {
								...curEdit
							});
						}}
						activeOpacity={0.8}
						style={[SS.ph16, SS.pv20, SS.row, SS.jsb, SS.ac, S.border(2)]}>
						<Text style={[SS.fz14]}>{I18n.t('account.exportMnemonic')}</Text>
						<SvgIcon size={16} name='right' />
					</TouchableOpacity>
				) : null}
				<TouchableOpacity
					onPress={() => {
						Base.push('user/removeWallet', { id });
					}}
					activeOpacity={0.8}
					style={[SS.ph16, SS.pv20, SS.row, SS.jsb, SS.ac, S.border(2)]}>
					<Text style={[SS.fz14]}>{I18n.t('account.removeTitle')}</Text>
					<SvgIcon size={16} name='right' />
				</TouchableOpacity>
			</Content>
			<NameDialog dialogRef={dialogRef} data={{ ...curEdit }} />
			<EnablePasswordDialog dialogRef={enableDialogRef} data={{ ...curEdit }} />
			<DisablePasswordDialog dialogRef={disableDialogRef} data={{ ...curEdit }} />
		</Container>
	);
};
