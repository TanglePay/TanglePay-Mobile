import React, { useEffect, useRef, useState } from 'react';
import { Base, I18n, IotaSDK } from '@tangle-pay/common';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useCreateCheck } from '@tangle-pay/store/common';
import { S, SS, Nav, ThemeVar, SvgIcon, Toast } from '@/common';
import { useLocation } from 'react-router-dom';
import { useGetNodeWallet, useChangeNode, useSelectWallet } from '@tangle-pay/store/common';
import { useRoute } from '@react-navigation/native';
import { Container, View, Text, Input, Textarea, Form, Item, Button, Label, Content } from 'native-base';
import { TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

export const AccountHardwareImport = () => {
	const changeNode = useChangeNode();
	const pageSize = 5;
	const { params } = useRoute();
	const selectWallet = useSelectWallet();
	const nodes = IotaSDK.nodes.filter((e) => e.type == params?.type);
	const [list, setList] = useState([]);
	const [showList, setShowList] = useState([]);
	const [visible, setVisible] = useState(false);
	const [current, setCurrent] = useState(1);
	const getWalletList = async (current) => {
		Toast.showLoading();
		try {
			const walletList = await IotaSDK.getHardwareAddressList(current, pageSize);
			setList((list) => {
				const newList = [...list];
				walletList.forEach((e) => {
					if (!newList.find((d) => d.address == e.address)) {
						newList.push(e);
					}
				});
				return newList;
			});
			setShowList(walletList);
			Toast.hideLoading();
		} catch (error) {
			Toast.hideLoading();
			Toast.show(String(error));
		}
	};
	useEffect(() => {
		getWalletList(current);
	}, [current, IotaSDK.curNode?.id]);
	return (
		<Container>
			<Nav title={I18n.t('account.lederImport')} />
			<Content contentContainerStyle={[SS.ph16]}>
				<Text style={[SS.pv16, SS.fz16, SS.fw600]}>{I18n.t('account.selectNode')}</Text>
				<TouchableOpacity
					style={[SS.ac, SS.jsb, SS.row, SS.bgS, SS.w100, SS.ph16, { height: 48, borderRadius: 10 }]}
					onPress={() => {
						setVisible(true);
					}}>
					<Text style={[SS.fz16, SS.fw400]}>{IotaSDK.curNode.name}</Text>
					<SvgIcon name='down' style={[SS.cS]} size={16} />
				</TouchableOpacity>
				{list.length > 0 ? (
					<>
						<Text style={[SS.pt24, SS.fz16, SS.fw600]}>Select an Account</Text>
						<View>
							{showList.map((e) => {
								const hasSelect = !!list.find((d) => d.address == e.address && d.hasSelect);
								const borderColor = e.hasImport ? '#ccc' : hasSelect ? '#3671EE' : '#ccc';
								const background = e.hasImport ? '#ccc' : hasSelect ? '#3671EE' : 'transparent';
								return (
									<TouchableOpacity
										key={e.address}
										style={[SS.row, SS.pv8, SS.ac, SS.jsb, S.border(2), SS.mt8]}
										disabled={e.hasImport}
										onPress={() => {
											if (e.hasImport) {
												return;
											}
											const getList = (arr) => {
												const newList = JSON.parse(JSON.stringify(arr));
												const i = newList.findIndex((d) => d.address == e.address);
												newList[i] = { ...e, hasSelect: !hasSelect };
												return newList;
											};
											setList((list) => {
												return getList(list);
											});
										}}>
										<View
											className='border'
											style={[
												S.border(4),
												{
													borderRadius: 4,
													width: 16,
													height: 16,
													borderColor,
													padding: 1,
													backgroundColor: background
												}
											]}></View>
										<Text style={[SS.ml25, SS.fz14, SS.fw400, SS.tl, { width: 40 }]}>
											{e.index}
										</Text>
										<Text style={[SS.fz14, SS.fw400, SS.tl, { width: 90 }]}>
											{Base.handleAddress(e.address)}
										</Text>
										<Text
											ellipsizeMode='tail'
											numberOfLines={1}
											style={[SS.fz14, SS.fw400, SS.tr, SS.mr25, { flex: 1 }]}>
											{Base.formatNum(
												IotaSDK.getNumberStr(e.balance / Math.pow(10, IotaSDK.curNode?.decimal))
											)}
											{IotaSDK.curNode.token}
										</Text>
										{e.hasImport ? (
											<SvgIcon
												onPress={() => {
													selectWallet(e.id);
													Base.replace('main');
												}}
												name='share'
												style={SS.cP}
												size={16}
											/>
										) : (
											<View style={{ width: 16, height: 16 }} />
										)}
									</TouchableOpacity>
								);
							})}
							<View style={[SS.row, SS.c, SS.mt16]}>
								<Button
									primary
									disabled={current == 1}
									transparent
									onPress={() => {
										setCurrent(current - 1);
									}}
									style={[SS.c, SS.mr12]}>
									<SvgIcon
										color={current == 1 ? ThemeVar.buttonDisabledBg : ThemeVar.brandPrimary}
										style={{ lineHeight: 0 }}
										name='left'
										size={14}
									/>
									<Text style={[SS.fz14, SS.pl8, { lineHeight: 0 }]}>PREV</Text>
								</Button>
								<Button
									primary
									transparent
									style={[SS.c, SS.mr16]}
									onPress={() => {
										setCurrent(current + 1);
									}}>
									<Text style={[SS.fz14, SS.pr8, { lineHeight: 0 }]}>NEXT</Text>
									<SvgIcon
										color={ThemeVar.brandPrimary}
										style={{ lineHeight: 0 }}
										name='right'
										size={14}
									/>
								</Button>
							</View>
						</View>
						<View style={[SS.row, SS.ac, SS.jsb, SS.ph16, { marginTop: 40 }]}>
							<Button
								primary
								bordered
								block
								style={[SS.mr24, SS.flex1]}
								onPress={() => {
									Base.replace('main');
								}}>
								<Text>{I18n.t('apps.cancel')}</Text>
							</Button>
							<Button
								primary
								style={[SS.flex1]}
								block
								onPress={async () => {
									const selectList = list.filter((e) => e.hasSelect);
									if (selectList.length == 0) {
										return Toast.show('Please select the account that needs to be imported.');
									}
									const addressList = await Promise.all(
										selectList.map((e) => {
											return IotaSDK.importHardware({
												address: e.address,
												name: `${params.name} ${e.index}`,
												publicKey: e.publicKey,
												path: e.path,
												type: 'ledger'
											});
										})
									);
									let walletsList = await IotaSDK.getWalletList();
									walletsList = [...walletsList, ...addressList];
									walletsList = [
										...walletsList.map((e) => {
											return { ...e, isSelected: false };
										})
									];
									walletsList[walletsList.length - 1].isSelected = true;
									Base.globalDispatch({
										type: 'common.walletsList',
										data: [...walletsList]
									});
									Base.replace('main');
								}}>
								<Text>{I18n.t('assets.importBtn')}</Text>
							</Button>
						</View>
					</>
				) : null}
			</Content>
			<Modal
				hasBackdrop
				backdropOpacity={0.3}
				onBackButtonPress={() => setVisible(false)}
				onBackdropPress={() => setVisible(false)}
				style={[SS.je, SS.p0, SS.m0]}
				isVisible={visible}>
				<View style={[SS.w100, SS.radius10, SS.bgW, SS.pv24]}>
					{nodes.map((e) => {
						return (
							<TouchableOpacity
								activeOpacity={0.8}
								style={[SS.row, SS.ac, SS.jsb, SS.pv32, SS.pr20, SS.radius8, S.border(2)]}
								key={e.id}
								onPress={() => {
									changeNode(e.id);
									setVisible(false);
								}}>
								<View style={[SS.row, SS.ac, { width: (ThemeVar.deviceWidth / 3) * 2 }]}>
									<Text style={[SS.ml12, SS.fz16, SS.fw500]}>{e.name}</Text>
								</View>
								<SvgIcon
									name='select'
									style={[e.id === IotaSDK.curNode?.id ? SS.cP : SS.cS]}
									size='20'
								/>
							</TouchableOpacity>
						);
					})}
				</View>
			</Modal>
		</Container>
	);
};
