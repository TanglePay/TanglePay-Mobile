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
import { context, checkIsWalletPasswordEnabled } from '@tangle-pay/domain'

const schema = Yup.object().shape({
	password: Yup.string().required()
});

const schemaNopassword = Yup.object().shape({

})
export const ClaimSMR = () => {
	const form = useRef();
	const [isShow, setShow] = useState(false);

	let { params } = useRoute();
	const id = params.id;
	const [_, walletsList] = useGetNodeWallet();
	const curEdit = walletsList.find((e) => e.id === id) || {};
	const name = curEdit.name || '';
	const addWallet = useAddWallet();
	const changeNode = useChangeNode();
	const [isWalletPassowrdEnabled, setIsWalletPassowrdEnabled] = useState(false)
    useEffect(() => {
        checkIsWalletPasswordEnabled(curEdit.id).then((res) => {
            setIsWalletPassowrdEnabled(res)
        })
    }, [])
	const hide = () => {
		setShow(false);
	};
	return (
		<Container>
			<Nav title={name} />
			<Content style={[SS.ph16]}>
				<View style={[SS.pv24]}>
					<View style={[S.border(4), SS.radius8, SS.p8]}>
						<Text style={[SS.fz14, SS.cS, { lineHeight: 20, wordBreak: 'break-all' }]}>
							{curEdit.address}
						</Text>
					</View>
				</View>
				<View style={[SS.c, SS.pb16]}>
					<Text style={[SS.fz16, SS.fw600]}>{I18n.t('shimmer.claimStakingRewards')}</Text>
				</View>
				<Formik
					innerRef={form}
					initialValues={{}}
					validateOnBlur={false}
					validateOnChange={false}
					validateOnMount={false}
					validationSchema={isWalletPassowrdEnabled ? schema : schemaNopassword}
					onSubmit={async (values) => {
						let password = ''
                        if (isWalletPassowrdEnabled) {
                            password = values.password
                            if (!Base.checkPassword(password)) {
                                return Toast.error(I18n.t('account.intoPasswordTips'))
                            }
                        } else {
                            password = context.state.pin
                        }
						try {
							await changeNode(IotaSDK.SMR_NODE_ID);
							const res = await IotaSDK.claimSMR({ ...curEdit, password });
							if (res.code > 0) {
								if (res.code === 200) {
									addWallet({
										...res.addressInfo,
										password
									});
									Base.replace('assets/claimReward/claimResult', { id, amount: res.amount });
								} else {
									setShow(true);
								}
							}
						} catch (error) {
							console.log(error);
							setShow(true);
						}
					}}>
					{({ handleChange, handleSubmit, values, errors }) => (
						<View>
							<Form>
								<Text style={[SS.fz14, SS.mb16]}>
									{I18n.t('account.showKeyInputPassword').replace(/{name}/, curEdit.name)}
								</Text>
								<Item style={[SS.mb16, SS.pl0, SS.ml0, S.border(2)]} error={!!errors.password}>
									<Input
										style={[SS.fz16]}
										secureTextEntry
										placeholder={I18n.t('account.intoPasswordTips')}
										onChangeText={handleChange('password')}
										value={values.password}
										maxLength={20}
									/>
								</Item>
							</Form>
							<View style={[{ marginTop: 100 }]}>
								<Button onPress={handleSubmit} disabled={!values.password && isWalletPassowrdEnabled} color='primary' block>
									<Text>{I18n.t('shimmer.claim')}</Text>
								</Button>
							</View>
						</View>
					)}
				</Formik>
			</Content>
			<Modal hasBackdrop backdropOpacity={0.3} onBackButtonPress={hide} onBackdropPress={hide} isVisible={isShow}>
				<View style={[SS.radius10, SS.bgW, SS.pa]}>
					<Text style={[SS.pv12, SS.ph16, SS.fz16, SS.fw600, S.border(2)]}>
						{I18n.t('shimmer.claimingFailed')}
					</Text>
					<Text style={[SS.p16, SS.fz16, { lineHeight: 24 }]}>
						{I18n.t('shimmer.claimingFailedTips')
							.replace('{name}', curEdit.name)
							.replace('{address}', Base.handleAddress(curEdit.address))
							.split('##')
							.filter((e) => !!e)
							.map((e, i) => {
								return (
									<Text style={i === 1 ? [SS.fw600, SS.cP] : []} key={i}>
										{e}
									</Text>
								);
							})}
					</Text>
					<View style={[SS.ph16, SS.pb16]}>
						<Button
							onPress={() => {
								setShow(false);
							}}
							color='primary'
							block>
							<Text>{I18n.t('shimmer.understand')}</Text>
						</Button>
					</View>
				</View>
			</Modal>
		</Container>
	);
};
