import React, { useState, useImperativeHandle } from 'react';
import { View, Text, Spinner } from 'native-base';
import { TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { useChangeNode } from '@tangle-pay/store/common';
import { I18n, Base, IotaSDK } from '@tangle-pay/common';
import { S, SS, ThemeVar, Toast } from '@/common';
import { useStore } from '@tangle-pay/store';
import { isNewWalletFlow } from '@tangle-pay/domain';
export const AddDialog = ({ dialogRef, nodeId }) => {
	const [isShow, setShow] = useState(false);
	const [isShowNode, setShowNode] = useState(true);
	const [loading, setLoading] = useState(false);
	const [curNodeId] = useStore('common.curNodeId');
	const curNode = IotaSDK.nodes.find((e) => e.id == curNodeId) || {};
	const changeNode = useChangeNode();
	useImperativeHandle(
		dialogRef,
		() => {
			return {
				show
			};
		},
		[]
	);
	const show = async (showNodeId) => {
		if (nodeId || showNodeId) {
			setShowNode(false);
			setLoading(true);
			await changeNode(parseInt(nodeId || showNodeId));
			setLoading(false);
		} else {
			setShowNode(true);
		}
		setLoading(false);
		setShow(true);
	};
	const hide = () => {
		setShow(false);
	};
	const list = [];
	let evmName = [];
	const nodes = JSON.parse(JSON.stringify(IotaSDK.nodes));
	nodes.forEach((e) => {
		if (IotaSDK.checkWeb3Node(e.id)) {
			if (!e.isHideInAdd) {
				if (!list.find((d) => d.type == e.type)) {
					list.push({ ...e });
				}
				evmName.push(e.name);
			}
		} else {
			list.push({ ...e });
		}
	});
	const evmData = list.find((e) => IotaSDK.checkWeb3Node(e.id));
	if (evmData) {
		evmData.name = `EVM (${evmName.join(' / ')})`;
	}
	return (
		<Modal
			style={[SS.m0, SS.je]}
			hasBackdrop
			backdropOpacity={0.3}
			onBackButtonPress={hide}
			onBackdropPress={hide}
			isVisible={isShow}>
			<View style={[SS.ph16, SS.w100, { borderTopRightRadius: 24, borderTopLeftRadius: 24 }, SS.bgS, SS.pr]}>
				<View style={[SS.c, SS.pt24, SS.pb16]}>
					<Text style={[SS.fz16, SS.fw600]}>{I18n.t('assets.addWallets')}</Text>
				</View>
				{isShowNode ? (
					<>
						<Text style={[SS.fz14, SS.cS, SS.mb16]}>{I18n.t('account.selectNode')}</Text>
						<View style={[SS.mb24, SS.bgW, SS.radius8]}>
							{list.map((e, i) => {
								return (
									<TouchableOpacity
										key={e.id}
										activeOpacity={0.8}
										onPress={async () => {
											if (loading) {
												return;
											}
											setLoading(true);
											await changeNode(e.id);
											setLoading(false);
											setShowNode(false);
										}}
										style={[
											{ height: 72 },
											SS.jc,
											SS.pl24,
											S.border(0, i == 0 ? 'transparent' : '#ccc')
										]}>
										<Text style={[SS.fz16]}>{e.name}</Text>
									</TouchableOpacity>
								);
							})}
						</View>
						{loading && (
							<View style={[SS.c, SS.row, SS.pa, { width: ThemeVar.deviceWidth, bottom: 160 }]}>
								<Spinner size='large' color='gray' />
							</View>
						)}
					</>
				) : (
					<>
						<View style={[SS.bgW, SS.radius8]}>
							<TouchableOpacity
								activeOpacity={0.8}
								onPress={() => {
									hide();
									if (isNewWalletFlow()) {
										Base.push('account/registerPin');
									} else {
										Base.push('account/register');
									}
								}}
								style={[{ height: 72 }, SS.pl24, SS.jc]}>
								<Text style={[SS.fz16]}>{I18n.t('account.createTitle')}</Text>
							</TouchableOpacity>
							{/* {curNode?.type == 3 && (
								<TouchableOpacity
									activeOpacity={0.8}
									onPress={() => {
										// Toast.show(I18n.t('account.unopen'));
										hide();
										Base.push('assets/claimReward');
									}}
									style={[{ height: 72 }, SS.pl24, SS.jc, S.border(0)]}>
									<Text style={[SS.fz16]}>{I18n.t('shimmer.claimStakingReward')}</Text>
								</TouchableOpacity>
							)} */}
						</View>
						<Text style={[SS.fz16, SS.cS, SS.mv16]}>{I18n.t('account.intoBtn')}</Text>
						<View style={[SS.mb24, SS.bgW, SS.radius8]}>
							<TouchableOpacity
								activeOpacity={0.8}
								onPress={() => {
									hide();
									if (isNewWalletFlow()) {
                                        Base.push('account/intopin', { type: 1 })
                                    } else {
                                        Base.push('account/into', { type: 1 })
                                    }
								}}
								style={[{ height: 72 }, SS.pl24, SS.jc]}>
								<Text style={[SS.fz16]}>{I18n.t('account.intoTitle1')}</Text>
							</TouchableOpacity>
							{(curNode?.type == 1 || curNode?.type == 3) && (
								<TouchableOpacity
									activeOpacity={0.8}
									onPress={() => {
										// hide();
										Toast.show(I18n.t('account.unopen'));
										// Base.push('account/into', { type: 2 });
									}}
									style={[{ height: 72 }, SS.pl24, SS.jc, S.border(0)]}>
									<Text style={[SS.fz16]}>{I18n.t('account.intoTitle2')}</Text>
								</TouchableOpacity>
							)}
							{curNode?.type == 2 && (
								<TouchableOpacity
									activeOpacity={0.8}
									onPress={() => {
										hide();
										Base.push('account/into/privateKey');
									}}
									style={[{ height: 72 }, SS.pl24, SS.jc, S.border(0)]}>
									<Text style={[SS.fz18]}>{I18n.t('account.privateKeyImport')}</Text>
								</TouchableOpacity>
							)}
						</View>
						{IotaSDK.isIotaAccordingId(curNodeId) ? null : 
							<>
								<Text style={[SS.fz16, SS.cS, SS.mv16]}>{I18n.t('account.hardwareWallet')}</Text>
								<View style={[SS.mb24, SS.bgW, SS.radius8]}>
									<TouchableOpacity
										activeOpacity={0.8}
										onPress={() => {
											hide();
											Base.push('account/hardware/into');
										}}
										style={[{ height: 72 }, SS.pl24, SS.jc, S.border(0)]}>
										<Text style={[SS.fz16]}>{I18n.t('account.hardwareWallet')}</Text>
									</TouchableOpacity>
								</View>
							</>
						}
					</>
				)}
			</View>
		</Modal>
	);
};
