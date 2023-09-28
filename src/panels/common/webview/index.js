import React, { useEffect, useState, useRef } from 'react';
import { Container, Content, Right, Button } from 'native-base';
import { useRoute } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { Nav, ThemeVar } from '@/common';
import { S, SS } from '@/common';
import { Base, I18n, IotaSDK } from '@tangle-pay/common';
import { Bridge } from '@/common/bridge';
import { SvgIcon } from '@/common/assets';
import { useGetNodeWallet } from '@tangle-pay/store/common';
import { StatusBar, Dimensions, View, Text, Image, TouchableOpacity } from 'react-native';
import Modal from "react-native-modal";

const deviceHeight = Dimensions.get('screen').height;
const toolH = ThemeVar.platform === 'ios' ? 40 : 40 + StatusBar.currentHeight;
const webviewH = deviceHeight - toolH;

export const CommonWebview = () => {

	const [isModalVisible, setModalVisible] = useState(false);
	const [curWallet] = useGetNodeWallet();
	const { params } = useRoute();
	const webview = useRef();
	const [url, setWebviewUrl] = useState(params.url);

	const hideModal = () => {
		setModalVisible(false)
	}

	const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

	const refreshWebview = () => {
		if(webview && webview.current) {
			webview.current.reload()
			toggleModal()
		}
	}

	useEffect(() => {
		Base.navigator.setParams({
			...params,
			setWebviewUrl
		});
		try {
			const arr = url.split('//');
			const protocol = arr[0];
			Bridge.origin = `${protocol}//${arr[1].split('/')[0]}`;
		} catch (error) {
			Bridge.origin = '';
		}
		Bridge.injectJavaScript = (e) => webview.current.injectJavaScript(e);
	}, []);
	useEffect( () => {
		const asyncFunc = async ()=>{
			if (curWallet.address) {
				const obj = {
					address: curWallet.address,
					nodeId: curWallet.nodeId
				};
				if (IotaSDK.checkWeb3Node(curWallet.nodeId)) {
					try {
						obj.chainId = await IotaSDK.client.eth.getChainId();
					} catch (error) {}
				}
				Bridge.accountsChanged(obj);
			}
		}
		asyncFunc();
	}, [curWallet.address + curWallet.nodeId]);
	return (
		<>
			<Container>
				<Nav
					leftIcon={null}
					title={params.title || ''}
					headerStyle={{ height: toolH }}
					rightContent={
						<Right style={[S.border(4, '#DEDEDE', 1), S.radius(15), { flexBasis: 82, flexGrow: 0}]}>
							{
								[{
									name: 'tool',
									onPress: () => {
										toggleModal()
									}
								}, {
									name: 'radio',
									onPress: () => { Base.goBack() }
								}].map(({name, onPress}, index) => 
								<Button
									onPress={onPress}
									style={[S.h(20), S.radius(0), SS.mr0, SS.pl10, SS.pr10, SS.ph0, SS.mv5, index > 0 ? S.border(3, '#D2D2D2', 1) : {}]}
									transparent
									>
									<SvgIcon name={name} size={20} color={ThemeVar.textColor} />
								</Button>)
							}
						</Right>
					}
				/>
				<WebView
					ref={webview}
					cacheEnabled={true}
					injectedJavaScript={Bridge.injectedJavaScript}
					onMessage={(e) => Bridge.onMessage(e)}
					style={{ flex: 1 }}
					source={{ uri: url }}
					startInLoadingState={true}
				/>
				<Modal 
					style={[SS.m0, SS.w100, SS.h100, SS.je]}
					hasBackdrop
					backdropOpacity={0.3}
					onBackButtonPress={hideModal}
					onBackdropPress={hideModal}
					isVisible={isModalVisible}>
						<View style={[ SS.ph16, SS.w100, SS.bgS, { borderTopRightRadius: 24, borderTopLeftRadius: 24, flexGrow: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' } ]}>
							<View style={[SS.acr, SS.flex, SS.pv16, S.border(2, 'rgba(0, 0, 0, 0.08)', 1)]}>
								<Image style={[S.wh(18, 16), SS.mr8]} source={{ uri: Base.getIcon(params.icon) }} />
								<View>
									<Text style={[SS.fz16, SS.fw500]}>{params.title}</Text>
								</View>
							</View>
							<View style={[SS.pv16, S.border(2, 'rgba(0, 0, 0, 0.08)', 1)]}>
								<SvgIcon name='refresh' size={60} color={ThemeVar.textColor} onPress={refreshWebview}/>
								<Text style={[SS.fz10, SS.mt4, S.w(60), SS.tc]}>{I18n.t('apps.refresh')}</Text>
							</View>
							<TouchableOpacity style={[SS.mt16, SS.mb24]} onPress={toggleModal}>
								<Text style={[SS.fz14, SS.tc, S.lineHeight(24), ]}>{I18n.t('apps.cancel')}</Text>
							</TouchableOpacity>
						</View>
				</Modal>
			</Container>
		</>
	);
};
