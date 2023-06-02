import React, { useState, useImperativeHandle, useRef, useEffect } from 'react';
import { View, Text, Form, Item, Input, Button, Step } from 'native-base';
import { ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import { Base, I18n, IotaSDK } from '@tangle-pay/common';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useEditWallet } from '@tangle-pay/store/common';
import { useSelectWallet } from '@tangle-pay/store/common';
import { SvgIcon, S, SS, ThemeVar } from '@/common';
import { StepInput } from '@/common/components/StepInput';
import BigNumber from 'bignumber.js';
import { Platform, PermissionsAndroid, TouchableOpacity } from 'react-native';
import TransportBLE from '@ledgerhq/react-native-hw-transport-ble';
import { Observable } from 'rxjs';
import { PERMISSIONS, RESULTS, requestMultiple } from 'react-native-permissions';

const deviceAddition =
	(device) =>
	({ devices }) => ({
		devices: devices.some((i) => i.id === device.id) ? devices : devices.concat(device)
	});
export const BleDevices = ({ dialogRef }) => {
	const [isShow, setShow] = useState(false);
	const resolveRef = useRef();
	const rejectRef = useRef();
	const [sub, setSub] = useState();
	const [devices, setDevices] = useState([]);
	const [refreshing, setRefreshing] = useState(false);
	console.log(devices);
	useImperativeHandle(
		dialogRef,
		() => {
			return {
				show
			};
		},
		[]
	);
	const getPermissions = async (callBack) => {
		if (Platform.OS === 'android') {
			await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
			await requestMultiple([PERMISSIONS.ANDROID.BLUETOOTH_SCAN, PERMISSIONS.ANDROID.BLUETOOTH_CONNECT]);
		}
		let previousAvailable = false;
		TransportBLE.observeState({
			next: (e) => {
				if (e.available !== previousAvailable) {
					previousAvailable = e.available;
					if (e.available) {
						setDevices([]);
						setRefreshing(false);
					}
				}
				callBack && callBack();
			},
			complete: () => {},
			error: () => {}
		});
	};
	const startScan = async (reject) => {
		setRefreshing(true);
		const sub = TransportBLE.listen({
			next: (e) => {
				try {
					if (e.type === 'add') {
						const device = e.descriptor;
						setDevices((list) => {
							const newList = [...list];
							if (!newList.find((d) => d.id == device?.id)) {
								newList.push(device);
							}
							return newList;
						});
					}
				} catch (error) {
					reject(error);
				}
			},
			complete: () => {
				setRefreshing(true);
			},
			error: (err) => {
				setRefreshing(false);
				reject(err);
			}
		});
		setSub(sub);
	};
	const show = async () => {
		return new Promise(async (resolve, reject) => {
			resolveRef.current = resolve;
			rejectRef.current = reject;
			const isSupported = await TransportBLE.isSupported();
			if (!isSupported || Base.transport) {
				resolve();
			} else {
				try {
					await getPermissions(async () => {
						await startScan(reject);
						setShow(true);
					});
				} catch (error) {
					reject(error);
				}
			}
		});
	};
	const clear = () => {
		if (sub) {
			sub.unsubscribe();
		}
		setRefreshing(false);
		setDevices([]);
	};
	const hide = async (info) => {
		setShow(false);
		clear();
		if (info) {
			try {
				Base.transport = await TransportBLE.open(info.id,true);
				if (resolveRef.current) {
					resolveRef.current();
				}
			} catch (error) {
				rejectRef.current(error);
			}
		} else {
			if (rejectRef.current) {
				rejectRef.current(new Error('Please connect a Bluetooth device'));
			}
		}
	};
	useEffect(() => {
		return () => {
			clear();
		};
	}, []);
	return (
		<Modal
			hasBackdrop
			backdropOpacity={0.3}
			onBackButtonPress={() => hide()}
			onBackdropPress={() => hide()}
			style={[SS.je, SS.p0, SS.m0]}
			isVisible={isShow}>
			<View style={[SS.w100, SS.radius10, SS.bgW, { height: ThemeVar.deviceHeight / 2 }]}>
				<View style={[SS.c, SS.pt20]}>
					<Text style={[SS.fw600, SS.fz16]}>Searching for Bluetooth devices</Text>
				</View>
				<ScrollView contentContainerStyle={[SS.p16]}>
					{devices.map((e, index) => {
						return (
							<TouchableOpacity
								activeOpacity={0.8}
								style={[SS.row, SS.ac, SS.jsb, SS.pv16, SS.pr20, SS.bgS, SS.radius8, SS.mb8]}
								key={index}
								onPress={() => {
									hide(e);
								}}>
								<View style={[SS.row, SS.ac, { width: (ThemeVar.deviceWidth / 3) * 2 }]}>
									<Text style={[SS.ml12, SS.fz16, SS.fw500]}>{e.name || JSON.stringify(e)}</Text>
								</View>
								<SvgIcon name='select' style={[SS.cS]} size='20' />
							</TouchableOpacity>
						);
					})}
				</ScrollView>
			</View>
		</Modal>
	);
};
