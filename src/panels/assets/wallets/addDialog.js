import React, { useState, useImperativeHandle } from 'react';
import { View, Text, Spinner } from 'native-base';
import { TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { useChangeNode } from '@tangle-pay/store/common';
import { I18n, Base, IotaSDK } from '@tangle-pay/common';
import { S, SS, ThemeVar, Toast } from '@/common';
import { useStore } from '@tangle-pay/store';
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
	const show = () => {
		if (nodeId) {
			setShowNode(false);
			changeNode(parseInt(nodeId));
		} else {
			setShowNode(true);
		}
		setLoading(false);
		setShow(true);
	};
	const hide = () => {
		setShow(false);
	};
	return (
		<Modal
			style={[SS.m0, SS.je]}
			hasBackdrop
			backdropOpacity={0.3}
			onBackButtonPress={hide}
			onBackdropPress={hide}
			isVisible={isShow}>
			<View style={[SS.ph20, SS.w100, SS.radius10, SS.bgS, SS.pr]}>
				<View style={[SS.c, SS.pv15]}>
					<Text style={[SS.fz16, SS.cS]}>{I18n.t('assets.addWallets')}</Text>
				</View>
				{isShowNode ? (
					<>
						<Text style={[SS.fz16, SS.cS, SS.mt20, SS.mb10]}>{I18n.t('account.selectNode')}</Text>
						<View style={[SS.mb50, SS.bgW, SS.radius10]}>
							{IotaSDK.nodes.map((e, i) => {
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
										style={[SS.pv30, SS.jc, SS.pl30, S.border(0, '#ddd', i == 0 ? 0 : 1)]}>
										<Text style={[SS.fz18]}>{e.name}</Text>
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
						<TouchableOpacity
							activeOpacity={0.8}
							onPress={() => {
								hide();
								Base.push('account/register');
							}}
							style={[SS.pv30, SS.c, SS.bgW, SS.radius10]}>
							<Text style={[SS.fz18]}>{I18n.t('account.createTitle')}</Text>
						</TouchableOpacity>
						<Text style={[SS.fz16, SS.cS, SS.mt20, SS.mb10]}>{I18n.t('account.intoBtn')}</Text>
						<View style={[SS.mb50, SS.bgW, SS.radius10]}>
							<TouchableOpacity
								activeOpacity={0.8}
								onPress={() => {
									hide();
									Base.push('account/into', { type: 1 });
								}}
								style={[SS.pv30, SS.c]}>
								<Text style={[SS.fz18]}>{I18n.t('account.intoTitle1')}</Text>
							</TouchableOpacity>
							{curNode?.type == 1 && (
								<TouchableOpacity
									activeOpacity={0.8}
									onPress={() => {
										hide();
										Toast.show(I18n.t('account.unopen'));
										// Base.push('account/into', { type: 2 });
									}}
									style={[SS.pv30, SS.c, S.border(0)]}>
									<Text style={[SS.fz18]}>{I18n.t('account.intoTitle2')}</Text>
								</TouchableOpacity>
							)}
							{curNode?.type == 2 && (
								<TouchableOpacity
									activeOpacity={0.8}
									onPress={() => {
										hide();
										Base.push('account/into/privateKey');
									}}
									style={[SS.pv30, SS.c, S.border(0)]}>
									<Text style={[SS.fz18]}>{I18n.t('account.privateKeyImport')}</Text>
								</TouchableOpacity>
							)}
						</View>
					</>
				)}
			</View>
		</Modal>
	);
};
