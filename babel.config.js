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
					'@tangle-pay/common': 'tanglepay/lib/app/common',
					'@tangle-pay/store': 'tanglepay/lib/app/store',
					'@tangle-pay/domain': 'tanglepay/lib/app/domain',
					'@tangle-pay/assets': 'tanglepay/lib/app/assets',
					'@ledgerhq/cryptoassets/data': '@ledgerhq/cryptoassets/lib/data',
					crypto: 'react-native-crypto'
				}
			}
		],
		'lodash',
		[
			'babel-plugin-rewrite-require',
			{
				aliases: {
					crypto: 'react-native-crypto',
					_stream_transform: 'readable-stream/transform',
					_stream_readable: 'readable-stream/readable',
					_stream_writable: 'readable-stream/writable',
					_stream_duplex: 'readable-stream/duplex',
					_stream_passthrough: 'readable-stream/passthrough',
					stream: 'stream-browserify',
					http: '@tradle/react-native-http',
					https: 'https-browserify',
					os: 'react-native-os'
				}
			}
		]
	],
	env: {
		production: {
			plugins: ['transform-remove-console']
		}
	}
};
