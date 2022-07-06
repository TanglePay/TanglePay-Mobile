import React, { useEffect, useState } from 'react';
import { Container, Content, View, Text, Input, Item } from 'native-base';
import { TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { AssetsNav, SvgIcon, SS, ThemeVar } from '@/common';
import { useGetNodeWallet } from '@tangle-pay/store/common';
import { List } from './list';
import { Base } from '@tangle-pay/common';
import _uniq from 'lodash/uniq';
import { useStore } from '@tangle-pay/store';
import { useGetDappsConfig } from '@tangle-pay/store/dapps';

export const Apps = () => {
	useGetDappsConfig();
	const [curWallet] = useGetNodeWallet();
	const [dapps] = useStore('dapps.list');
	const [keywords] = useStore('dapps.keywords');
	const [tabs, setTabs] = useState([]);
	const [list, setList] = useState([]);
	const [searchStr, setSearch] = useState('');
	const [showList, setShowList] = useState([]);
	const [curTab, setCurTab] = useState('All');
	const checkPush = (path) => {
		if (!curWallet.address) {
			Base.push('account/register');
			return;
		}
		Base.push(path);
	};
	useEffect(() => {
		const newList = list.filter((e) => e.tags.includes(curTab));
		if (!searchStr) {
			setShowList(newList);
		} else {
			const str = searchStr.toLocaleLowerCase();
			setShowList(
				newList.filter((e) => {
					let { id, desc, developer, url } = e;
					if (
						[id, desc, developer, url].find((a) =>
							String(a || '')
								.toLocaleLowerCase()
								.includes(str)
						)
					) {
						return true;
					}
					return false;
				})
			);
		}
	}, [searchStr, curTab, JSON.stringify(list)]);
	const onBlur = () => {
		if (/^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/.test(searchStr)) {
			Base.push(`http://${searchStr}`);
		} else if (/(http|https):\/\/([\w.]+\/?)\S*/.test(searchStr)) {
			Base.push(searchStr);
		}
	};
	useEffect(() => {
		let tabs = [];
		const list = [];
		for (const i in dapps) {
			const item = dapps[i];
			list.push({ ...item, id: i });
			tabs = _uniq([...tabs, ...item.tags]);
		}
		tabs = tabs.map((e) => {
			return {
				label: e
			};
		});
		setList(list);
		setTabs(tabs);
	}, [JSON.stringify(dapps)]);
	return (
		<Container>
			{/* <AssetsNav hasScan /> */}
			<Content
				contentContainerStyle={[
					SS.ph20,
					{ paddingTop: ThemeVar.platform === 'android' ? StatusBar.currentHeight + 24 : 24 }
				]}>
				<Item inlineLabel>
					<Input value={searchStr} onChangeText={setSearch} onBlur={onBlur} placeholder='Search Dapp' />
				</Item>
				<View style={[SS.row, SS.ac, SS.pt20, SS.jsb, { flexWrap: 'wrap' }]}>
					{keywords.map((e) => {
						return (
							<TouchableOpacity
								activeOpacity={0.8}
								onPress={() => setSearch(e.url)}
								key={e.label}
								style={[SS.p10, SS.mb10, SS.bgS, SS.radius10]}>
								<Text style={[SS.fz12]}>{e.label}</Text>
							</TouchableOpacity>
						);
					})}
				</View>
				<View>
					<ScrollView scrollEnabled horizontal showsHorizontalScrollIndicator={false}>
						<View style={[SS.ac, SS.row, SS.pt30, SS.pb15]}>
							{tabs.map((e) => {
								const cur = curTab === e.label;
								return (
									<TouchableOpacity
										activeOpacity={0.8}
										style={[SS.pv10, SS.pr10]}
										key={e.label}
										onPress={() => {
											setCurTab(e.label);
										}}>
										<Text style={[SS.fz15, SS.mr10, !cur && SS.cB, cur && SS.fw600, cur && SS.cP]}>
											{e.label}
										</Text>
									</TouchableOpacity>
								);
							})}
						</View>
					</ScrollView>
					<List list={showList} />
				</View>
			</Content>
		</Container>
	);
};
