const fs = require('fs');
const path = require('path');
const temPath = path.join(__dirname, './template/LocalSingleIcon.js.template');
const iconPath = path.join(
	__dirname,
	'../node_modules/react-native-iconfont-cli/templates/LocalSingleIcon.js.template'
);

fs.copyFileSync(temPath, iconPath);

const imageViewPath = path.join(__dirname, './template/react-native-image-view_src_ImageView.js');
const libImageViewPath = path.join(__dirname, '../node_modules/react-native-image-view/src/ImageView.js');

fs.copyFileSync(imageViewPath, libImageViewPath);

const cachePath = path.join(__dirname, './template/react-native-img-cache_index.js');
const libCachePath = path.join(__dirname, '../node_modules/react-native-img-cache/build/index.js');

fs.copyFileSync(cachePath, libCachePath);

const txPath = path.join(__dirname, './template/@ethereumjs-tx-dist.browser-transactionFactory.js');
const libTxPath = path.join(__dirname, '../node_modules/@ethereumjs/tx/dist.browser/transactionFactory.js');

fs.copyFileSync(txPath, libTxPath);

const iotaNextPath = path.join(__dirname, './template/iota-next-index-app.js');
const libIotaNextPath = path.join(__dirname, '../node_modules/@iota/iota.js-next/dist/cjs/index-node.js');
fs.copyFileSync(iotaNextPath, libIotaNextPath);

const mqttNextPath = path.join(__dirname, './template/iota.mqtt-next-app.js');
const libMqttNextPath = path.join(__dirname, '../node_modules/@iota/mqtt.js-next/dist/cjs/index-node.js');
fs.copyFileSync(mqttNextPath, libMqttNextPath);
