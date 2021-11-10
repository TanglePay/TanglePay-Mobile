import Storage from 'react-native-storage';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { DeviceEventEmitter } from 'react-native';
import { StackActions } from '@react-navigation/native';
import RNSInfo from 'react-native-sensitive-info';
import DeviceInfo from 'react-native-device-info';

// local storage
const storage = new Storage({
	size: 1000,
	storageBackend: AsyncStorage,
	defaultExpires: null, //过期时间
	enableCache: true
});

export const Base = {
	DEBUG: process.env.NODE_ENV !== 'production',
	globalTemData: {},
	set navigator(ref) {
		this._navigator = ref;
	},
	get navigator() {
		return this._navigator;
	},
	handlerParams(url) {
		const obj = {};
		url.replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => (obj[k] = decodeURIComponent(v)));
		return obj;
	},
	push(path, props) {
		if (!path || !this._navigator) {
			return;
		}
		if (/http(s?):\/\//.test(path)) {
			props = { ...this.handlerParams(path), ...props };
			return this._navigator.navigate('common/webview', { ...props, url: path });
		}
		if (/\?/.test(path)) {
			props = { ...this.handlerParams(path), ...props };
			path = path.split('?')[0];
		}
		try {
			this._navigator.navigate(path, props);
		} catch (error) {
			console.log(error);
		}
	},
	goBack(n = 1) {
		try {
			this._navigator && this._navigator.canGoBack() && this._navigator.dispatch(StackActions.pop(n));
		} catch (error) {
			console.log(error);
		}
	},
	popToTop() {
		try {
			this._navigator && this._navigator.dispatch(StackActions.popToTop());
		} catch (error) {
			console.log(error);
		}
	},
	replace(path, props) {
		this._navigator && this._navigator.dispatch(StackActions.replace(path, props));
	},
	addEvt(evtName, listener) {
		return DeviceEventEmitter.addListener(evtName, listener);
	},
	removeEvt(listener) {
		if (listener && listener.remove) {
			listener.remove();
		}
	},
	removeAllEvt(evtName) {
		DeviceEventEmitter.removeAllListeners(evtName);
	},
	sendEvt(evtName, data) {
		DeviceEventEmitter.emit(evtName, data);
	},
	async getLocalData(s_key) {
		try {
			const res = await storage.load({ key: s_key });
			return res;
		} catch (error) {
			return null;
		}
	},
	setLocalData(s_key, data) {
		// data are considered as sensitive and saved on keychains
		storage.save({ key: s_key, data: data });
	},
	async getSensitiveInfo(key) {
		try {
			let data = await RNSInfo.getItem(key, {
				sharedPreferencesName: 'TanglePay',
				keychainService: 'TanglePayData'
			});
			data = JSON.parse(data);
			return data || null;
		} catch (error) {
			return null;
		}
	},
	async setSensitiveInfo(key, data) {
		await RNSInfo.setItem(key, JSON.stringify(data), {
			sharedPreferencesName: 'TanglePay',
			keychainService: 'TanglePayData'
		});
	},
	async removeSensitiveInfo(key) {
		await RNSInfo.deleteItem(key, {
			sharedPreferencesName: 'TanglePay',
			keychainService: 'TanglePayData'
		});
	},
	checkMobi(mobi) {
		return /^1\d{10}$/.test(mobi);
	},
	handleAddress(address) {
		return (address || '').replace(/(^.{4})(.+)(.{4}$)/, '$1...$3');
	},
	guid() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			const r = (Math.random() * 16) | 0;
			const v = c == 'x' ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
	},
	formatNum(num, len) {
		if (num.constructor.name === 'BigNumber') {
			num = num.valueOf();
		}
		return parseFloat(num).toFixed(len || 2);
	},
	checkPassword(password) {
		if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
			return false;
		}
		return true;
	},
	// check if it is iOS 14.x to workaround input box bugs
	get isIos14() {
		let systemVersion = DeviceInfo.getSystemVersion();
		return Platform.OS === 'ios' && /^14/.test(systemVersion);
	}
};
