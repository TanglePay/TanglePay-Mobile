import React, { useEffect, useState } from 'react';
import { Container, Content, View, Text, Input, Item, Button, Spinner } from 'native-base';
import { Nav, S, SS, SvgIcon, ThemeVar, Toast } from '@/common';
import { Base, I18n } from '@tangle-pay/common';
import Modal from 'react-native-modal';
import { useCollect, useGetWalletInfo, useGetNodeWallet } from '@tangle-pay/store/common';

export const WalletCollection = () => {
	const [, totalInfo, loading, getInfo] = useGetWalletInfo();
	const [curWallet] = useGetNodeWallet();
	const [password, setPassword] = useState('');
	const [isShow, setShow] = useState(false);
	const [list, setList] = useState([]);
	const [start, stop] = useCollect();
	let handeNum = list?.length || 0;
	const totalNum = totalInfo?.outputIds?.length || 0;
	handeNum = handeNum <= totalNum ? handeNum : totalNum;
	const handleStop = async () => {
		Toast.show(I18n.t('account.collectSuccTips'));
		stop();
		setShow(false);
		Toast.showLoading();
		await getInfo();
		Toast.hideLoading();
		Base.goBack();
	};
	useEffect(() => {
		if (handeNum >= totalNum) {
			handleStop();
		}
	}, [handeNum, totalNum]);
	return (
		<>
			<Container>
				<Nav title={curWallet.name} />
				<Content>
					<View style={[S.border(2), SS.p16]}>
						<View style={[S.border(4), SS.p8, { borderRadius: 8 }]}>
							<Text style={[SS.fz14, SS.cS]}>{curWallet.address}</Text>
						</View>
					</View>
					<View style={[SS.ph16, SS.pv24]}>
						<View style={[SS.c, SS.pb20]}>
							<Text style={[SS.fz18]}>{I18n.t('account.outputCollect')}</Text>
						</View>
						<View style={[SS.row, SS.ac, SS.mt10]}>
							<Text style={[SS.fz16, SS.cS, SS.mr24]}>{I18n.t('account.pendingNum')}</Text>
							<Text style={[SS.fz16, SS.cP, SS.fw600]}>{totalNum}</Text>
						</View>
						<Text style={[SS.fz16, SS.mt24]}>{I18n.t('assets.passwordTips')}</Text>
						<Input
							secureTextEntry
							value={password}
							onChangeText={setPassword}
							style={[S.border(2), SS.pv10]}
						/>
						<Button
							onPress={() => {
								if (password !== curWallet.password) {
									return Toast.error(I18n.t('assets.passwordError'));
								}
								start(curWallet, setList);
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
								borderRadius: 16,
								marginLeft: 8,
								marginRight: 8
							}
						]}>
						<View style={[S.border(2), SS.ph16, SS.pv15]}>
							<Text style={[SS.fz16, SS.fw600]}>{I18n.t('account.outputCollect')}</Text>
						</View>
						<View style={[SS.p16, SS.row, SS.ac, SS.jsb]}>
							<Text style={[SS.fz16, SS.cS]}>{I18n.t('account.processedNum')}</Text>
							<View style={[SS.row, SS.ac]}>
								{handeNum < totalNum ? (
									<Spinner color={ThemeVar.brandPrimary} size='small' style={[SS.mr15]} animating />
								) : null}
								<Text style={[SS.cP, SS.fw600, SS.fz16]}>
									{handeNum} / {totalNum}
								</Text>
							</View>
						</View>
						<View style={[SS.p15]}>
							<Button block onPress={handleStop}>
								<Text>{I18n.t('account.collectTermination')}</Text>
							</Button>
						</View>
					</View>
				</Modal>
			) : null}
		</>
	);
};
