import React, { useEffect, useState, useRef } from 'react';
import { Container, Content, View, Text, Input, Item, Button, Spinner } from 'native-base';
import { Nav, S, SS, SvgIcon, ThemeVar, Toast } from '@/common';
import { Base, I18n, IotaSDK } from '@tangle-pay/common';
import Modal from 'react-native-modal';
import { useCollect, useGetWalletInfo, useGetNodeWallet } from '@tangle-pay/store/common';
import { context, checkWalletIsPasswordEnabled } from '@tangle-pay/domain';
import { BleDevices } from '@/common/components/bleDevices';

export const WalletCollection = () => {
	const bleDevices = useRef();
	const [, totalInfo, loading, getInfo] = useGetWalletInfo();
	const [curWallet] = useGetNodeWallet();
	const [password, setPassword] = useState('');
	const [isShow, setShow] = useState(false);
	const [list, setList] = useState([]);
	const [start, stop] = useCollect();
	let handeNum = list?.length || 0;
	const [isWalletPassowrdEnabled, setIsWalletPassowrdEnabled] = useState(false);
	const isLedger = curWallet.type == 'ledger';
	useEffect(() => {
		checkWalletIsPasswordEnabled(curWallet.id).then((res) => {
			setIsWalletPassowrdEnabled(res);
		});
	});
	const totalNum = totalInfo?.outputIds?.length || 0;
	handeNum = handeNum <= totalNum ? handeNum : totalNum;
	const handleStop = async () => {
		Toast.success(I18n.t('account.collectSuccTips'));
		stop();
		setShow(false);
		getInfo();
		Base.goBack();
		setTimeout(() => {
			getInfo();
		}, 3000);
	};
	useEffect(() => {
		if (handeNum >= totalNum && handeNum > 0) {
			handleStop();
		}
	}, [handeNum, totalNum]);
	return (
		<>
			<Container>
				<Nav title={curWallet.name} />
				<Content>
					<View style={[SS.p16]}>
						<View style={[S.border(4), SS.p8, { borderRadius: 8 }]}>
							<Text style={[SS.fz14, SS.cS]}>{curWallet.address}</Text>
						</View>
					</View>
					<View style={[SS.ph16, SS.pt16]}>
						<View style={[SS.row, SS.ac, SS.pb10]}>
							<Text style={[SS.fz16]}>{I18n.t('account.outputCollect')}</Text>
						</View>
						<View style={[SS.row, SS.ac, SS.mt10]}>
							<Text style={[SS.fz14, SS.cS, SS.mr24]}>{I18n.t('account.pendingNum')}</Text>
							<Text style={[SS.fz16, SS.cP, SS.fw600]}>{totalNum}</Text>
						</View>
						{isWalletPassowrdEnabled && !isLedger ? (
							<>
								<Text style={[SS.fz14, SS.mt24]}>{I18n.t('assets.passwordTips')}</Text>
								<Input
									secureTextEntry
									value={password}
									onChangeText={setPassword}
									style={[S.border(2), SS.pv10]}
								/>
							</>
						) : null}
						<Button
							disabled={!password && isWalletPassowrdEnabled && !isLedger}
							onPress={async () => {
								let walletPassword = password;
								if (!isWalletPassowrdEnabled) {
									walletPassword = context.state.pin;
								}
								if (!isLedger) {
									const isPassword = await IotaSDK.checkPassword(curWallet.seed, walletPassword);
									if (!isPassword) {
										return Toast.error(I18n.t('assets.passwordError'));
									}
								}
								if (isLedger) {
									await bleDevices.current.show();
								}
								start({ ...curWallet, password: walletPassword }, setList);
								setShow(true);
							}}
							style={[SS.mt40, SS.mb16]}
							block>
							<Text>{I18n.t('account.outputCollect')}</Text>
						</Button>
					</View>
				</Content>
			</Container>
			{isShow ? (
				<Modal animationIn='fadeIn' hasBackdrop backdropOpacity={0.5} isVisible={isShow}>
					<View
						style={[
							SS.bgW,
							{
								borderRadius: 16
							}
						]}>
						<View style={[S.border(2), SS.ph16, SS.pv12]}>
							<Text style={[SS.fz16, SS.fw600]}>{I18n.t('account.outputCollect')}</Text>
						</View>
						<View style={[SS.ph16, SS.row, SS.ac, SS.jsb]}>
							<Text style={[SS.fz16, SS.cS]}>{I18n.t('account.processedNum')}</Text>
							<View style={[SS.row, SS.ac]}>
								<Spinner
									color={ThemeVar.brandPrimary}
									size='small'
									style={[SS.mr15, { opacity: handeNum < totalNum ? 1 : 0 }]}
									animating
								/>
								<Text style={[SS.cP, SS.fw600, SS.fz16]}>
									{handeNum} / {totalNum}
								</Text>
							</View>
						</View>
						<View style={[SS.ph16, SS.pb16]}>
							<Button block onPress={handleStop}>
								<Text>{I18n.t('account.collectTermination')}</Text>
							</Button>
						</View>
					</View>
				</Modal>
			) : null}
			<BleDevices dialogRef={bleDevices} />
		</>
	);
};
