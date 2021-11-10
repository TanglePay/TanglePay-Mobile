import Config from 'react-native-config';
import { Toast } from '@/common/components/Toast';
export default {
	request(method, url, params = {}) {
		return new Promise((resolve, reject) => {
			params = { ...params };
            // indicates whether prompting 'loading' messages
            const loading = params.loading
            // if isHandlerError=false, fallback to default hander which prompts error message
			const isHandlerError = params.isHandlerError;
			isHandlerError && delete params.isHandlerError;
			url = `${Config.API_URL}?${url}`;
			if (method === 'GET') {
				let paramsUrl = '';
				for (let [key, value] of Object.entries(params)) {
					paramsUrl += key + '=' + value + '&';
				}
				url = `${url}${/\?/.test(url) ? '&' : '?'}${paramsUrl}`;
				url = url.replace(/&$/, '');
				params = null;
			}
			loading && Toast.showLoading();
			fetch(url, {
				method,
				body: params ? JSON.stringify(params) : undefined,
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				}
			})
				.then((response) => response.json())
				.then((result) => {
					Toast.hideLoading();
					const { msg, data, status } = result;
					if (parseInt(status) !== 0) {
						if (!isHandlerError) {
							Toast.error(msg);
							return null;
						}
						return resolve(result);
					}
					return resolve(data);
				})
				.catch((error) => {
					Toast.hideLoading();
					return reject(error);
				});
		});
	},
	clearTimeout() {
		this.timeoutHandler && clearTimeout(this.timeoutHandler);
		this.timeoutHandler = null;
	},
	// promiseRequest(method, url, params = {}) {
	// 	return new Promise((resolve, reject) => {
	// 		this.clearTimeout();
	// 		this.timeoutHandler = setTimeout(() => {
	// 			reject({});
	// 			this.hideLoading();
	// 			Toast.show('请求超时');
	// 			this.timeoutHandler = null;
	// 		}, 15000);
	// 		this.request(method, url, params)
	// 			.then((data) => {
	// 				resolve(data);
	// 				this.clearTimeout();
	// 			})
	// 			.catch((error) => {
	// 				reject(error);
	// 				this.clearTimeout();
	// 			});
	// 	});
	// },
	async GET(url, params = {}) {
		return this.request('GET', url, params);
	},
	async POST(url, params = {}) {
		// console.log(url, params);
		return this.request('POST', url, params);
	},
	async DELETE(url, params = {}) {
		return this.request('DELETE', url, params);
	}
};
