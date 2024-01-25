import React, { useEffect, useRef, useState } from 'react';
import { Base, I18n, IotaSDK } from '@tangle-pay/common';
import { Formik } from 'formik';
import { Container, View, Text, Input, Textarea, Form, Item, Button, Label, Content } from 'native-base';
import * as Yup from 'yup';
import { useCreateCheck, useAddWallet } from '@tangle-pay/store/common';
import { S, SS, Nav, ThemeVar, SvgIcon, Toast } from '@/common';
import { BleDevices } from '@/common/components/bleDevices';
import { context, setPin, ensureInited, shouldShowSetPin } from '@tangle-pay/domain';
const getSchema = (shouldShowPin) => {
	if (shouldShowPin) {
		return Yup.object().shape({
			name: Yup.string().required(),
			password: Yup.string().required(),
			rePassword: Yup.string().required(),
			agree: Yup.bool().isTrue().required()
		});
	} else {
		return Yup.object().shape({
			name: Yup.string().required(),
			agree: Yup.bool().isTrue().required()
		});
	}
};
export const AccountHardwareInto = () => {
	const form = useRef();
	const [isLoading, setLoading] = useState(false);
	const addWallet = useAddWallet();
	const [shouldShowPin, setShouldShowPin] = useState(true);

	useEffect(() => {
		const fn = async () => {
			await ensureInited();
			console.log(context);
			setShouldShowPin(shouldShowSetPin());
		};
		fn();
	}, []);
	const bleDevices = useRef();
	useCreateCheck((name) => {
		if (!IotaSDK.checkWeb3Node(IotaSDK.curNode?.id)) {
			form.current.setFieldValue('name', name);
		}
	});
	return (
		<Container>
			<Nav title={I18n.t('account.connectLedger')} />
			<Content>
				<Formik
					innerRef={form}
					initialValues={{
						agree: true
					}}
					validateOnBlur={false}
					validateOnChange={false}
					validateOnMount={false}
					validationSchema={getSchema(shouldShowPin)}
					onSubmit={async (values) => {
						try {
							if (isLoading) {
								return;
							}
							const { password, rePassword } = values;
							if (shouldShowPin) {
								if (!Base.checkPin(password)) {
									return Toast.error(I18n.t('account.intoPinTips'));
								}
								if (password !== rePassword) {
									return Toast.error(I18n.t('account.checkPin'));
								}
								await setPin(password);
							}
							setLoading(true);
							const curNodeId = IotaSDK.curNode?.id;
							const isIota = IotaSDK.checkIota(curNodeId);
							const isShimmer = IotaSDK.checkSMR(curNodeId);
							let checkList = [];
							Toast.showLoading();
							const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
							await sleep(500);
							if (isIota || isShimmer) {
								checkList = await IotaSDK.getHardwareAddressInIota(curNodeId, false, 0, 1, 0, 2);
								const balanceList = await Promise.all(
									checkList.map((d) => {
										return IotaSDK.getBalance(
											{
												id: '',
												address: d.address,
												nodeId: curNodeId
											},
											[d.address]
										);
									})
								);
								checkList.forEach((e, i) => {
									e.balances = [
										{
											balance: balanceList[i]?.list?.[0]?.realBalance,
											nodeId: curNodeId
										}
									];
									e.index = i + 1;
								});
							} else if (IotaSDK.checkWeb3Node(curNodeId)) {
								await IotaSDK.checkHardwareConnect();
								checkList = await IotaSDK.getHardwareAddressList(1, 2);
								checkList.forEach((e, i) => {
									e.index = i + 1;
								});
							}
							let hasBalanceList = checkList.filter((e) => e.balances.find((d) => Number(d.balance) > 0));
							for (let i = 0; i < checkList.length; i++) {
								const e = checkList[i];
								checkList[i].hasImport = await IotaSDK.checkImport(e.address);
							}
							Toast.hideLoading();
							setLoading(false);
							const needImportList = hasBalanceList.filter((e) => !e.hasImport);
							if (needImportList.length <= 1) {
								const obj = needImportList[0] || checkList[0];
								try {
									const res = await IotaSDK.importHardware({
										address: obj.address,
										name: `${values.name}-${obj.index}`,
										publicKey: obj.publicKey || '',
										path: obj.path,
										type: 'ledger'
									});
									addWallet({
										...res
									});
									Base.replace('main');
								} catch (error) {
									Toast.show(String(error));
								}
							} else {
								// 进入硬件钱包导入，传入list
								Base.push('account/hardware/import', {
									name: values.name,
									list: JSON.stringify(hasBalanceList)
								});
							}
						} catch (error) {
							setLoading(false);
							Toast.show(String(error));
						}
					}}>
					{({ handleChange, handleSubmit, setFieldValue, values, errors }) => (
						<View style={[SS.p16]}>
							<Form>
								<Text style={[SS.fz14, SS.mt24]}>{I18n.t('account.intoName')}</Text>
								<Item style={[SS.mt8, SS.ml0]} error={!!errors.name}>
									<Input
										style={[SS.fz14, SS.pl0, S.h(44)]}
										placeholder={I18n.t('account.intoNameTips')}
										onChangeText={handleChange('name')}
										value={values.name}
									/>
								</Item>
								{shouldShowPin && (
									<>
										<Label style={[SS.fz14, SS.mt24]}>{I18n.t('account.intoPin')}</Label>
										<Item style={[SS.mt8, SS.ml0]} error={!!errors.password}>
											<Input
												keyboardType='ascii-capable'
												secureTextEntry
												textContentType={Base.isIos14 ? 'oneTimeCode' : 'none'}
												maxLength={20}
												style={[SS.fz14, SS.pl0, S.h(44)]}
												placeholder={I18n.t('account.intoPinTips')}
												onChangeText={handleChange('password')}
												value={values.password}
											/>
										</Item>
										<Input style={[S.h(1)]} />
										<Item style={[SS.mt8, SS.ml0]} error={!!errors.rePassword}>
											<Input
												keyboardType='ascii-capable'
												secureTextEntry
												textContentType={Base.isIos14 ? 'oneTimeCode' : 'none'}
												maxLength={20}
												style={[SS.fz14, SS.pl0, S.h(44)]}
												placeholder={I18n.t('account.intoRePin')}
												onChangeText={handleChange('rePassword')}
												value={values.rePassword}
											/>
										</Item>
									</>
								)}
								<View style={[SS.mt20]} />
								<Item
									style={[SS.row, SS.as, SS.ml0, SS.mb40, { borderBottomWidth: 0 }]}
									onPress={() => {
										setFieldValue('agree', !values.agree);
									}}>
									<SvgIcon
										color={values.agree ? ThemeVar.brandPrimary : ThemeVar.textColor}
										size={16}
										style={[SS.mr8, S.marginT(4)]}
										name={values.agree ? 'checkbox_1' : 'checkbox_0'}
									/>
									<View style={[S.w(ThemeVar.deviceWidth - 50)]}>
										<Text
											style={[
												SS.fz14,
												S.tl,
												S.lineHeight(22),
												S.color(!errors.agree ? '#eee' : ThemeVar.brandDanger)
											]}>
											{I18n.t('account.intoAgree')
												.split('##')
												.filter((e) => !!e)
												.map((e, i) => {
													return i % 2 ? (
														<Text
															onPress={() => {
																Base.push(
																	i === 1
																		? 'https://tanglepay.com/terms.html'
																		: 'https://tanglepay.com/policy.html'
																);
															}}
															key={i}
															style={[SS.cP]}>
															{e}
														</Text>
													) : (
														<Text key={i}>{e}</Text>
													);
												})}
										</Text>
									</View>
								</Item>
								<Button block onPress={handleSubmit}>
									<Text>{I18n.t('account.intoBtn')}</Text>
								</Button>
							</Form>
						</View>
					)}
				</Formik>
			</Content>
			<BleDevices dialogRef={bleDevices} />
		</Container>
	);
};
