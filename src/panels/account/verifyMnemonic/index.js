import React, { useState, useRef } from 'react';
import { Container, View, Text, Button } from 'native-base';
import { StyleSheet, Vibration } from 'react-native';
import { Base, Nav1, S, SS, ThemeVar, I18n } from '@tangle-pay/common';
import Carousel from 'react-native-snap-carousel';
import { useRoute } from '@react-navigation/native';

const VerifyItem = ({ setNext, index, word, err, isTop, isLast }) => {
	const [error, setError] = useState(false);
	const handleVerify = (curWord) => {
		if (word === curWord) {
			isLast ? Base.push('account/verifySucc') : setNext();
		} else {
			Vibration.vibrate();
		}
		setError(word !== curWord);
	};
	const topStr = isTop ? word : err;
	const bottomStr = isTop ? err : word;
	return (
		<View style={[SS.ph50, SS.bgW]}>
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
	const { params } = useRoute();
	const { list, errList } = params;
	const carousel = useRef();
	const setNext = () => {
		carousel.current.snapToNext();
	};
	return (
		<Container>
			<Nav1 title={I18n.t('account.testBackup')} />
			<Carousel
				ref={carousel}
				layout='stack'
				scrollEnabled={false}
				data={list}
				renderItem={({ item, index }) => (
					<VerifyItem
						setNext={setNext}
						key={`${item.word}_${index}`}
						word={item}
						err={errList[index]}
						index={index}
						isTop={Math.random() >= 0.5}
						isLast={index === list.length - 1}
					/>
				)}
				sliderWidth={ThemeVar.deviceWidth}
				itemWidth={ThemeVar.deviceWidth}
			/>
		</Container>
	);
};

const styles = StyleSheet.create({});
