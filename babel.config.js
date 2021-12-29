module.exports = {
	presets: ['module:metro-react-native-babel-preset'],
	plugins: [
		[
			'module-resolver',
			{
				root: ['./'],
				alias: {
					'@': './src',
					'#': './native-base-theme',
					'@tangle-pay/common': 'tangle-pay/lib/app/common',
					'@tangle-pay/store': 'tangle-pay/lib/app/store'
				}
			}
		],
		'lodash'
	],
	env: {
		production: {
			plugins: ['transform-remove-console']
		}
	}
};
