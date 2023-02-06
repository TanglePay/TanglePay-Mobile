import React, { useEffect, useState } from 'react';
import { Container, Content, View, Text, Input, Item } from 'native-base';
import { TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { AssetsNav, SvgIcon, SS, ThemeVar } from '@/common';
import { useGetNodeWallet } from '@tangle-pay/store/common';
import { List } from './list';
import { Base } from '@tangle-pay/common';
import _uniq from 'lodash/uniq';
import { useStore } from '@tangle-pay/store';

export const Apps = () => {
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
			Base.push(`https://${searchStr}`);
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
		list.sort((a, b) => {
			return a.id === 'Iotabee' ? -1 : 0;
		});
		setList(list);
		setTabs(tabs);
	}, [JSON.stringify(dapps)]);
	return (
		<Container>
			{/* <AssetsNav hasScan /> */}
			<Content
				contentContainerStyle={[
					SS.ph16,
					{ paddingTop: ThemeVar.platform === 'android' ? StatusBar.currentHeight + 24 : 24 }
				]}>
				<View style={[{ height: 36, padding: 6 }, SS.row, SS.ac, SS.bgS, SS.radius10]}>
					<SvgIcon name='search' color='#ccc' size='20' />
					<Input
						style={[SS.fz16, SS.fw400, { height: 24 }, SS.pv0]}
						value={searchStr}
						onChangeText={setSearch}
						onBlur={onBlur}
						placeholder='Search Dapp'
					/>
				</View>
				<View style={[SS.row, SS.ac, SS.pt16, SS.jsb, { flexWrap: 'wrap' }]}>
					{keywords.map((e) => {
						return (
							<TouchableOpacity
								activeOpacity={0.8}
								onPress={() => setSearch(e.url)}
								key={e.label}
								style={[SS.ph16, SS.pv8, SS.mb10, SS.bgS, SS.radius10]}>
								<Text style={[SS.fz14]}>{e.label}</Text>
							</TouchableOpacity>
						);
					})}
				</View>
				<View>
					<ScrollView scrollEnabled horizontal showsHorizontalScrollIndicator={false}>
						<View style={[SS.ac, SS.row, SS.pt5, SS.pb10]}>
							{tabs.map((e) => {
								const cur = curTab === e.label;
								return (
									<TouchableOpacity
										activeOpacity={0.8}
										style={[{ height: 44 }, SS.jc]}
										key={e.label}
										onPress={() => {
											setCurTab(e.label);
										}}>
										<Text style={[SS.fz14, SS.mr24, !cur ? SS.cB : SS.cP]}>{e.label}</Text>
									</TouchableOpacity>
								);
							})}
						</View>
					</ScrollView>
					<List list={showList} curWallet={curWallet} />
				</View>
			</Content>
		</Container>
	);
};
