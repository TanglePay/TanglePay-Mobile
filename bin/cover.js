const fs = require('fs');
const path = require('path');
const temPath = path.join(__dirname, './template/LocalSingleIcon.js.template');
const iconPath = path.join(
	__dirname,
	'../node_modules/react-native-iconfont-cli/templates/LocalSingleIcon.js.template'
);

fs.copyFileSync(temPath, iconPath);