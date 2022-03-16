//该文件由bin_createPanel脚本自动生成，请勿手动更改
import { Main } from './main';
import { AccountLogin } from './account/login';
import { AccountRegister } from './account/register';
import { AccountInto } from './account/into';
import { AccountBackup } from './account/backup';
import { AccountMnemonic } from './account/mnemonic';
import { AccountVerifyMnemonic } from './account/verifyMnemonic';
import { AccountVerifySucc } from './account/verifySucc';
import { AssetsWallets } from './assets/wallets';
import { AssetsSend } from './assets/send';
import { AssetsReceive } from './assets/receive';
import { AssetsScan } from './assets/scan';
import { AssetsAddAssets } from './assets/addAssets';
import { UserWallets } from './user/wallets';
import { UserSetting } from './user/setting';
import { UserNetwork } from './user/network';
import { UserAboutUs } from './user/aboutUs';
import { UserLang } from './user/lang';
import { UserEditWallet } from './user/editWallet';
import { UserBackupWallet } from './user/backupWallet';
import { UserWalletPassword } from './user/walletPassword';
import { CommonWebview } from './common/webview';
import { AccountChangeNode } from './account/changeNode';
import { StakingAdd } from './staking/add';
import { StakingHistory } from './staking/history';
import { AppsExecute } from './apps/execute';
export const panelsList = [
	{
        path:"apps/execute",
        component:AppsExecute,
    },
	{
		path: 'staking/history',
		component: StakingHistory
	},
	{
		path: 'staking/add',
		component: StakingAdd
	},
	{
		path: 'account/changeNode',
		component: AccountChangeNode
	},
	{
		path: 'common/webview',
		component: CommonWebview
	},
	{
		path: 'user/walletPassword',
		component: UserWalletPassword
	},
	{
		path: 'user/backupWallet',
		component: UserBackupWallet
	},
	{
		path: 'user/editWallet',
		component: UserEditWallet
	},
	{
		path: 'user/lang',
		component: UserLang
	},
	{
		path: 'user/aboutUs',
		component: UserAboutUs
	},
	{
		path: 'user/network',
		component: UserNetwork
	},
	{
		path: 'user/setting',
		component: UserSetting
	},
	{
		path: 'user/wallets',
		component: UserWallets
	},
	{
		path: 'assets/addAssets',
		component: AssetsAddAssets
	},
	{
		path: 'assets/scan',
		component: AssetsScan
	},
	{
		path: 'assets/receive',
		component: AssetsReceive
	},
	{
		path: 'assets/send',
		component: AssetsSend
	},
	{
		path: 'assets/wallets',
		component: AssetsWallets
	},
	{
		path: 'account/verifySucc',
		component: AccountVerifySucc
	},
	{
		path: 'account/verifyMnemonic',
		component: AccountVerifyMnemonic
	},
	{
		path: 'account/mnemonic',
		component: AccountMnemonic
	},
	{
		path: 'account/backup',
		component: AccountBackup
	},
	{
		path: 'account/into',
		component: AccountInto
	},
	{
		path: 'account/register',
		component: AccountRegister
	},
	{
		path: 'account/login',
		component: AccountLogin
	},
	{
		path: 'main',
		component: Main
	}
];
