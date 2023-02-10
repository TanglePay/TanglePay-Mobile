import React, { useState, useRef } from 'react';
import { S, SS, Nav, Toast, SvgIcon } from '@/common';
import { I18n } from '@tangle-pay/common';
import { TouchableOpacity, Image } from 'react-native';
import { Container, View, Text, Content } from 'native-base';
import * as Yup from 'yup';
import { useGetNodeWallet } from '@tangle-pay/store/common';
import { useRoute } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';

export const NftDetail = () => {
	const { params } = useRoute();
	let { thumbnailImage, media, attributes } = params;
	attributes = attributes?.props || attributes || [];
	let propsList = [];
	for (const i in attributes) {
		if (Object.hasOwnProperty.call(attributes, i)) {
			const obj = attributes[i];
			let label = '';
			for (const j in obj) {
				if (j !== 'value') {
					label = j;
				}
			}
			propsList.push({
				label,
				value: obj.value
			});
		}
	}
	const [openDetail, setOpenDetail] = useState(false);
	const [openProperties, setOpenProperties] = useState(false);
	return (
		<Container>
			<Nav title={I18n.t('assets.nftInfo')} />
			<Content contentContainerStyle={[SS.ph32]}>
				<View style={[SS.c, { marginTop: 35, marginBottom: 32 }]}>
					<Image
						style={[S.wh(160), S.radius(36), SS.bgS, SS.mb8]}
						resizeMode='contain'
						source={{ uri: thumbnailImage || media }}
					/>
					<Text style={[SS.fz16, SS.mt8, SS.fw600, SS.tc]}>{params.name}</Text>
					<Text style={[SS.fz16, SS.mt4, SS.fw600, SS.cS]}>{params.issuerName}</Text>
					<Text style={[SS.fz14, SS.mt12, SS.fw600, SS.cS]}>{params.description}</Text>
				</View>
				<View>
					<TouchableOpacity
						onPress={() => {
							setOpenDetail(!openDetail);
						}}
						activeOpacity={0.8}
						style={[SS.row, SS.ac, S.h(32)]}>
						<Text style={[SS.fz18, SS.fw600, SS.mr4]}>{I18n.t('assets.nftDetail')}</Text>
						<SvgIcon
							size={14}
							name='up'
							style={[SS.cS, !openDetail && { transform: [{ rotate: '180deg' }] }]}
						/>
					</TouchableOpacity>
					{openDetail ? (
						<View>
							{params.standard ? (
								<View
									style={[
										SS.mt8,
										SS.bgS,
										SS.radius10,
										SS.ac,
										SS.row,
										SS.jsb,
										SS.ph12,
										{ height: 36 }
									]}>
									<Text style={[SS.fz14, SS.fw400]}>{I18n.t('assets.standard')}</Text>
									<Text style={[SS.fz14, SS.fw400]}>{params.standard}</Text>
								</View>
							) : null}
							<View style={[SS.mt8, SS.bgS, SS.radius10, SS.ph12, SS.pv12]}>
								<Text style={[SS.fz14, SS.fw400, SS.mb4]}>NFT ID</Text>
								<TouchableOpacity
									activeOpacity={0.8}
									onPress={() => {
										Clipboard.setString(params.nftId);
										Toast.success(I18n.t('assets.copied'));
									}}>
									<Text style={[SS.fz12, SS.fw400]}>{params.nftId}</Text>
								</TouchableOpacity>
							</View>
							<View style={[SS.mt8, SS.bgS, SS.radius10, SS.ph12, SS.pv12]}>
								<Text style={[SS.fz14, SS.fw400, SS.mb4]}>URI</Text>
								<TouchableOpacity
									activeOpacity={0.8}
									onPress={() => {
										Clipboard.setString(params.uri);
										Toast.success(I18n.t('assets.copied'));
									}}>
									<Text style={[SS.fz12, SS.fw400]}>{params.uri}</Text>
								</TouchableOpacity>
							</View>
							<View style={[SS.mt8, SS.bgS, SS.radius10, SS.ph12, SS.pv12]}>
								<Text style={[SS.fz14, SS.fw400, SS.mb4]}>{I18n.t('assets.collectionID')}</Text>
								<TouchableOpacity
									activeOpacity={0.8}
									onPress={() => {
										Clipboard.setString(params.collectionId);
										Toast.success(I18n.t('assets.copied'));
									}}>
									<Text style={[SS.fz12, SS.fw400]}>{params.collectionId}</Text>
								</TouchableOpacity>
							</View>
						</View>
					) : null}
				</View>
				<View style={[SS.mt16, SS.pb24]}>
					<TouchableOpacity
						onPress={() => {
							setOpenProperties(!openProperties);
						}}
						activeOpacity={0.8}
						style={[SS.row, SS.ac, S.h(32)]}>
						<Text style={[SS.fz18, SS.fw600, SS.mr4]}>{I18n.t('assets.nftProperties')}</Text>
						<SvgIcon
							size={14}
							name='up'
							style={[SS.cS, !openProperties && { transform: [{ rotate: '180deg' }] }]}
						/>
					</TouchableOpacity>
					{openProperties ? (
						<View style={[{ flexWrap: 'wrap' }, SS.ac, SS.row, SS.mt8]}>
							{propsList.map((e, i) => {
								return (
									<View key={i} style={[SS.bgS, SS.radius10, SS.p12, SS.mr8]}>
										<Text style={[SS.fz14, SS.cS, SS.fw600]}>{e.label}</Text>
										<Text style={[SS.fz14, SS.mt4, SS.cB, SS.fw600]}>{e.value}</Text>
									</View>
								);
							})}
						</View>
					) : null}
				</View>
			</Content>
		</Container>
	);
};
