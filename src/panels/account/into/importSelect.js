import React, { useEffect, useState } from 'react';
import { Base, I18n, IotaSDK } from '@tangle-pay/common';
import { S, SS, Nav, Toast } from '@/common';
import { useRoute } from '@react-navigation/native';
import { Container, View, Text, Button } from 'native-base';
import { TouchableOpacity, ScrollView } from 'react-native';
import { useStore } from '@tangle-pay/store';

export const AccountImportSelect = () => {
	const [registerInfo, setRegisterInfo] = useStore('common.registerInfo');
	const { params } = useRoute();
	let list = [];
	try {
		list = JSON.parse(params.list);
	} catch (error) {}
	const [showList, setShowList] = useState(list || []);
	useEffect(() => {
		const init = async () => {
			const newList = JSON.parse(JSON.stringify(showList));
			for (let i = 0; i < newList.length; i++) {
				const e = newList[i];
				const { balances } = e;
				const balanceList = [];
				balances.forEach((e) => {
					const node = IotaSDK.nodes.find((d) => d.id == e.nodeId) || {};
					if (Number(e.balance) > 0) {
						balanceList.push(
							`${Base.formatNum(IotaSDK.getNumberStr(e.balance / Math.pow(10, node.decimal)))} ${
								node.token
							}`
						);
					}
				});
				newList[i].balanceStr = balanceList.slice(0, 2).join(' / ');
				newList[i].hasImportc = await IotaSDK.checkImport(e.address);
				let address = (e.address || '')
					.replace(new RegExp(`^${IotaSDK.curNode?.bech32HRP || ''}`), '')
					.replace(/^0x/i, '');
				address = address.replace(/(^.{4})(.+)(.{6}$)/, '$1...$3');
				if (IotaSDK.curNode?.type == 2) {
					address = `0x${address}`;
				} else {
					address = `${IotaSDK.curNode?.bech32HRP || ''}${address}`;
				}
				newList[i].addressStr = address;
			}
			setShowList(newList);
		};
		init();
	}, []);
	return (
		<Container>
			<Nav title='Select an Account' />
			<ScrollView contentContainerStyle={[SS.ph16]}>
				{showList.length > 0 ? (
					<>
						<View>
							{showList.map((e) => {
								const hasSelect = !!showList.find((d) => d.address == e.address && d.hasSelect);
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
											const newList = JSON.parse(JSON.stringify(showList));
											const i = newList.findIndex((d) => d.address == e.address);
											newList.forEach((e) => (e.hasSelect = false));
											newList[i] = { ...e, hasSelect: true };
											setShowList(newList);
										}}>
										<View style={[SS.row, SS.ac]}>
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
														backgroundColor: background,
														marginRight: 8
													}
												]}></View>
											<Text style={[SS.fz14, SS.fw400, SS.tl, { width: 130 }]}>
												{e.addressStr}
											</Text>
										</View>
										<Text
											ellipsizeMode='tail'
											numberOfLines={1}
											style={[SS.fz14, SS.fw400, SS.tr, SS.mr25, { flex: 1 }]}>
											{e.balanceStr}
										</Text>
									</TouchableOpacity>
								);
							})}
						</View>
						<View style={[SS.row, SS.ac, SS.jsb, SS.ph16, { marginTop: 40 }]}>
							<Button
								primary
								bordered
								block
								style={[SS.mr24, SS.flex1]}
								onPress={() => {
									Base.popToTop();
									Base.replace('main');
								}}>
								<Text>{I18n.t('apps.cancel')}</Text>
							</Button>
							<Button
								primary
								style={[SS.flex1]}
								block
								onPress={async () => {
									const selectList = showList.filter((e) => e.hasSelect);
									if (selectList.length == 0) {
										return Toast.show('Please select the account that needs to be imported.');
									}
									const addressList = await Promise.all(
										selectList.map((e) => {
											return IotaSDK.importMnemonic({
												...registerInfo,
												name: `${registerInfo.name}-${
													Number(String(e.path).split('/').pop()) + 1
												}`,
												path: e.path
											});
										})
									);
									setRegisterInfo({});
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
									Base.popToTop();
									Base.replace('main');
								}}>
								<Text>{I18n.t('assets.importBtn')}</Text>
							</Button>
						</View>
					</>
				) : null}
			</ScrollView>
		</Container>
	);
};
