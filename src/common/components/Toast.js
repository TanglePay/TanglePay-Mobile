import { Toast as NativeBaseToast } from 'native-base';
import TinyToast from './react-native-tiny-toast';
const config = {
	duration: 2000,
	position: 'top',
	buttonStyle: { backgroundColor: 'transparent', width: 0 },
	buttonTextStyle: { color: 'transparent' }
};
let isLoading = false;
let timeHandler = null;
export const Toast = {
	show(text) {
		NativeBaseToast.show({
			text,
			...config
		});
	},
	success(text) {
		NativeBaseToast.show({
			text,
			type: 'success',
			...config
		});
	},
	error(text, params = {}) {
		NativeBaseToast.show({
			text,
			type: 'danger',
			...config,
			...params
		});
	},
	warning(text) {
		NativeBaseToast.show({
			text,
			type: 'warning',
			...config
		});
	},
	hide() {
		NativeBaseToast.hide();
	},
	showLoading(timer) {
		if (!isLoading) {
			TinyToast.showLoading();
		}
		if (timeHandler) {
			clearTimeout(timeHandler);
		}
		timeHandler = setTimeout(() => {
			TinyToast.hide();
			isLoading = false;
		}, timer || 90000);
		isLoading = true;
	},
	hideLoading() {
		isLoading = false;
		TinyToast.hide();
	}
};
