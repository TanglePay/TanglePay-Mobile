import Http from './http';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import CryptoJS from 'crypto-js';
const deviceNo = DeviceInfo.getUniqueId();
const clientType = Platform.OS === 'ios' ? 'IOS' : 'Android';
let token = '';
const trace = async (url, params) => {
	url = `${url}&token=${token || ''}`;
	// const curNodeId = await Base.getLocalData('common.curNodeId');
	// if (curNodeId === 2) {
	// 	return;
	// }
	return Http.POST(url, {
		clientType,
		deviceNo,
		isHandlerError: true,
		...params
	});
};
export default {
    // Trace.login
	login: async () => {
		const res = await trace('method=user.login');
		token = res.token;
	},
    // Trace.CreateWallet
    // {
    //  # ClientType (IOS, Android, Plugin)
    //     "clientType": "IOS",
    // 	# DeviceId
    //     "deviceNo": "123456"
    // 	# WalletId
    //     "walletIdentify": "1",
    // 	# WalletName
    //     "walletName": "Wallet-1",
    // 	# WalletAddress (hased by MD5)
    //     "address": "xxxxxx"
    // }
	createWallet: async (walletIdentify, walletName, address) => {
		trace('method=wallet.create', {
			walletIdentify,
			walletName,
			address: CryptoJS.MD5(address).toString()
		});
	},
    // Trace.ImportAccount
    // {
    // 	# WalletId
    //     "walletIdentify": "1",
    // 	# WalletAddress (hashed by MD5)
    //     "address": "xxxxxx"
    //  # Balance
    // 	   "amount": "900000"
    // }
	updateAddressAmount: async (walletIdentify, address, amount) => {
		trace('method=wallet.updateAddressAmount', {
			walletIdentify,
			address: CryptoJS.MD5(address).toString(),
			amount
		});
	},
    // Trace.Transfer
    // {
    //  # ClientType (IOS, Android, Plugin)
    //     "clientType": "IOS",
    // 	# DeviceNo
    //     "deviceNo": "123456",
    // 	# TransactionType（pay，receive）
    //     "type": "pay",
    // 	# TransacitonNum（messageId）
    //     "transactionNum": "123456",
    // 	# FromAddress (hashed by MD5)
    //     "fromAddress": "xxx",
    // 	# ReceiverAddress (hashed by MD5)
    //     "toAddress": "xxx",
    // 	# Amount
    //     "amount": "100000"
    // }
	transaction: async (type, transactionNum, fromAddress, toAddress, amount) => {
		trace('method=transaction.create', {
			type,
			transactionNum,
			fromAddress: CryptoJS.MD5(fromAddress).toString(),
			toAddress: CryptoJS.MD5(toAddress).toString(),
			amount
		});
	}
};
