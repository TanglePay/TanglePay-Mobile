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
