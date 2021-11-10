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
					'@sdk': './sdk'
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
