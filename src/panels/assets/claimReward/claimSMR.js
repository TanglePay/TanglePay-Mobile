import React, { useRef, useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { useGetNodeWallet, useChangeNode } from '@tangle-pay/store/common';
import { Base, I18n, IotaSDK } from '@tangle-pay/common';
import { Nav, S, Toast, SS, ThemeVar } from '@/common';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAddWallet } from '@tangle-pay/store/common';
import { View, Text, Container, Content, Form, Item, Input, Button } from 'native-base';
import Modal from 'react-native-modal';

const schema = Yup.object().shape({
	password: Yup.string().required()
});
const contentW = ThemeVar.deviceWidth;
export const ClaimSMR = () => {
	const form = useRef();
	const [isShow, setShow] = useState(false);
	let { params } = useRoute();
	params = Base.handlerParams(params.search);
	const id = params.id;
	const [_, walletsList] = useGetNodeWallet();
	const curEdit = walletsList.find((e) => e.id === id) || {};
	const name = curEdit.name || '';
	const addWallet = useAddWallet();
	const changeNode = useChangeNode();
	return (
		<Container>
			<Nav title={name} />
			<Content>
				<View style={[SS.pv16, SS.ph16]}>
					<View style={[S.border(4), SS.radius8, SS.p8]}>
						<Text style={[SS.fz16, SS.cS, { lineHeight: 20, wordBreak: 'break-all' }]}>
							{curEdit.address}
						</Text>
					</View>
				</View>
				<View style={[SS.c, SS.pt8, SS.pb16]}>
					<Text style={[SS.fz18, SS.fw600]}>Claim Shimmer Staking Rewards</Text>
				</View>
				<Formik
					innerRef={form}
					initialValues={{}}
					validateOnBlur={false}
					validateOnChange={false}
					validateOnMount={false}
					validationSchema={schema}
					onSubmit={async (values) => {
						setShow(true);
						// await changeNode(IotaSDK.SMR_NODE_ID)
						// const { password } = values
						// if (!Base.checkPassword(password)) {
						//     return Toast.error(I18n.t('account.intoPasswordTips'))
						// }
						// const res = await IotaSDK.claimSMR({ ...curEdit, password })
						// console.log(res, '-------------------------')
						// const seed = curEdit.seed
						// const res = await IotaSDK.importSMRBySeed(seed, password)
						// addWallet({
						//     ...res
						// })
						// IotaSDK.claimSMR(curEdit, res.address)

						// const sendRes = await IotaSDK.send(curEdit.address, res.address, sendAmount, {
						//     contract: assets?.contract,
						//     token: assets?.name
						// })
						// if (res) {
						//     Toast.hideLoading()
						//     Toast.success(
						//         I18n.t(
						//             IotaSDK.checkWeb3Node(curWallet.nodeId)
						//                 ? 'assets.sendSucc'
						//                 : 'assets.sendSuccRestake'
						//         )
						//     )
						//     Base.goBack()
						// }

						// Base.replace('/assets/claimReward/claimResult', { id })
					}}>
					{({ handleChange, handleSubmit, values, errors }) => (
						<View style={[SS.ph16]}>
							<Form>
								<Item style={[SS.mb16, SS.pl0, S.border(2)]} error={!!errors.password}>
									<View style={[SS.fz16, SS.mb16]}>{I18n.t('account.intoPassword')}</View>
									<Input
										style={[SS.fz16]}
										type='password'
										placeholder={I18n.t('account.intoPasswordTips')}
										onChangeText={handleChange('password')}
										value={values.password}
										maxLength={20}
									/>
								</Item>
							</Form>
							<View style={[SS.row, SS.ac, SS.jsb, { marginTop: 100 }]}>
								<Button
									onPress={handleSubmit}
									disabled={!values.password}
									style={{ height: 48 }}
									color='primary'
									block>
									<Text>Claim</Text>
								</Button>
							</View>
						</View>
					)}
				</Formik>
			</Content>
			<Modal hasBackdrop backdropOpacity={0.3} onBackButtonPress={hide} onBackdropPress={hide} isVisible={isShow}>
				<View style={{ width: contentW - 60 }} className='radius10 bgW pa-c'>
					<View className='pv12 ph16 fz18 fw600 border-b'>Claiming Failed </View>
					<Text style={[SS.p16, SS.fz16]}>
						您的IOTA钱包{' '}
						<Text style={[SS.fw600]}>
							{curEdit.name} {Base.handleAddress(curEdit.address)}
						</Text>{' '}
						中没有可以Claim的Shimmer Staking Rewards
					</Text>
					<View style={[SS.ph16, SS.pb16]}>
						<Button
							onPress={() => {
								setShow(false);
							}}
							style={{ height: 48 }}
							color='primary'
							block>
							<Text>I Understand</Text>
						</Button>
					</View>
				</View>
			</Modal>
		</Container>
	);
};
