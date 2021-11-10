import React, { useRef, useState } from 'react';
import { Container, Content, View, Text } from 'native-base';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { Base, Nav, S, SS, I18n, Icon, images, Toast, ThemeVar } from '@/common';
import { useRoute } from '@react-navigation/native';
import { NameDialog } from './nameDialog';
import { useGetNodeWallet } from '@/store/common';

export const UserEditWallet = () => {
	const { params } = useRoute();
	const id = params.id;
	const [_, walletsList] = useGetNodeWallet();
	const curEdit = walletsList.find((e) => e.id === id) || {};
	const name = curEdit.name || '';
	const dialogRef = useRef();
	return (
		<Container>
			<Nav title={I18n.t('user.manage')} />
			<Content>
				<View style={[SS.row, SS.p20, SS.ac, S.border(2)]}>
					<View style={[SS.c, S.wh(40), S.radius(40), SS.mr15, S.bg(ThemeVar.brandPrimary)]}>
						<Text style={[SS.cW, SS.fz15]}>{name[0] || ''}</Text>
					</View>
					<View>
						<View style={[SS.ac, SS.row, SS.mb10]}>
							<Text style={[SS.fz15, SS.mr10]}>{name}</Text>
							<Icon
								onPress={() => {
									dialogRef.current.show();
								}}
								style={[S.wh(16)]}
								name={images.com.edit}
							/>
						</View>
						<View style={[SS.ac, SS.row]}>
							<View style={[S.w(ThemeVar.deviceWidth - 90)]}>
								<Text style={[SS.fz15, SS.cS]}>
									{curEdit.address}
									<Icon
										onPress={() => {
											Clipboard.setString(curEdit.address);
											Toast.success(I18n.t('assets.copied'));
										}}
										style={[S.wh(16), SS.ml10]}
										name={images.com.copy}
									/>
								</Text>
							</View>
						</View>
					</View>
				</View>
				{/* <TouchableOpacity
					onPress={() => {
						Base.push('user/backupWallet');
					}}
					activeOpacity={0.8}
					style={[SS.p20, SS.row, SS.jsb, SS.ac, S.border(2)]}>
					<Text style={[SS.fz15]}>{I18n.t('user.backupWallet')}</Text>
					<Icon style={[S.wh(16)]} name={images.com.right} />
				</TouchableOpacity> */}
				<TouchableOpacity
					onPress={() => {
						Base.push('user/walletPassword', {
							...curEdit
						});
					}}
					activeOpacity={0.8}
					style={[SS.p20, SS.row, SS.jsb, SS.ac, S.border(2)]}>
					<Text style={[SS.fz15]}>{I18n.t('user.resetPassword')}</Text>
					<Icon style={[S.wh(16)]} name={images.com.right} />
				</TouchableOpacity>
			</Content>
			<NameDialog dialogRef={dialogRef} data={{ ...curEdit }} />
		</Container>
	);
};

const styles = StyleSheet.create({});
