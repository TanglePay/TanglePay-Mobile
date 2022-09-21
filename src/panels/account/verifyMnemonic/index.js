import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Container, View, Text, Button } from 'native-base';
import { Vibration } from 'react-native';
import { Base, I18n, IotaSDK } from '@tangle-pay/common';
import Carousel from 'react-native-snap-carousel';
import { useRoute } from '@react-navigation/native';
import { useStore } from '@tangle-pay/store';
import { useAddWallet } from '@tangle-pay/store/common';
import { S, SS, Nav, ThemeVar, Toast } from '@/common';

const VerifyItem = ({ setNext, index, word, err, isLast, addWallet }) => {
	const [error, setError] = useState(false);
	const [topStr, setTop] = useState('');
	const [bottomStr, setBottom] = useState('');
	const [registerInfo, seRegisterInfo] = useStore('common.registerInfo');
	const handleVerify = async (curWord) => {
		if (word === curWord) {
			if (isLast) {
				try {
					Toast.showLoading();
					const res = await IotaSDK.importMnemonic(registerInfo);
					addWallet(res);
					seRegisterInfo({});
					Toast.hideLoading();
					Base.popToTop();
					Base.replace('main');
				} catch (error) {
					console.log(error);
					Toast.hideLoading();
					Base.goBack();
				}
			} else {
				setNext();
			}
			// isLast ? Base.push('account/verifySucc') : setNext();
		} else {
			Vibration.vibrate();
		}
		setError(word !== curWord);
	};
	useEffect(() => {
		const isTop = Math.random() >= 0.5;
		let top = isTop ? word : err;
		let bottom = isTop ? err : word;
		setTop(top);
		setBottom(bottom);
	}, [index, word, err]);
	return (
		<View style={[SS.ph20, SS.bgW]}>
			<View style={[S.marginV(120)]}>
				<Text style={[SS.fz16, SS.tc, error && SS.cR]}>Word # {index + 1}</Text>
			</View>
			<View>
				<Button onPress={() => handleVerify(topStr)} style={[SS.mb20]} block light>
					<Text>{topStr}</Text>
				</Button>
				<Button onPress={() => handleVerify(bottomStr)} block light>
					<Text>{bottomStr}</Text>
				</Button>
			</View>
		</View>
	);
};

export const AccountVerifyMnemonic = () => {
	const addWallet = useAddWallet();
	const [curIndex, setCurInex] = useState(0);
	const { params } = useRoute();
	const { list, errList } = params;
	const carousel = useRef();
	const setNext = () => {
		carousel.current.snapToNext();
	};
	return (
		<Container>
			<Nav title={`${I18n.t('account.testBackup')} (${curIndex + 1}/${list.length})`} />
			<Carousel
				ref={carousel}
				layout='stack'
				scrollEnabled={false}
				data={list}
				onSnapToItem={(slideIndex) => {
					setCurInex(slideIndex);
				}}
				renderItem={({ item, index }) => (
					<VerifyItem
						addWallet={addWallet}
						setNext={setNext}
						key={`${item.word}_${index}`}
						word={item}
						err={errList[index]}
						index={index}
						isLast={index === list.length - 1}
					/>
				)}
				sliderWidth={ThemeVar.deviceWidth}
				itemWidth={ThemeVar.deviceWidth}
			/>
		</Container>
	);
};
