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
					// '@tangle-pay/common': 'tanglepay/lib/app/common',
					// '@tangle-pay/store': 'tanglepay/lib/app/store',
					// '@tangle-pay/assets': 'tanglepay/lib/app/assets',
					'@tangle-pay/common': './src/lib/app/common',
					'@tangle-pay/store': './src/lib/app/store',
					'@tangle-pay/assets': './src/lib/app/assets'
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
