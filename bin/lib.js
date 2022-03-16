'use strict';
let fs = require('fs');
let path = require('path');
let com = {
	// 获取命令行参数
	get args() {
		let npm_config_argv = JSON.parse(process.env.npm_config_argv);
		return npm_config_argv.original.filter((e) => e !== 'run');
	},
	//获取绝对路径
	getPath(url) {
		return path.resolve('./', url);
	},
	// 目录或文件是否存在，isThrow是否抛出错误
	exists(path, isThrow) {
		path = this.getPath(path);
		const exists = fs.existsSync(path);
		if (isThrow && exists) {
			throw `-------该路径已存在，请重命名-------${path}`;
		}
		return exists;
	},
	// 创建目录
	mkdir(path, isThrow) {
		path = this.getPath(path);
		const exists = this.exists(path, isThrow);
		if (!exists) {
			fs.mkdirSync(path);
		}
	},
	// 在指定字符串除插入字符串，isAfter(在该字符串后)
	insStrIndex(oldStr, specifyStr, insStr, isAfter) {
		const arr = oldStr.split(specifyStr);
		if (arr.length !== 2) {
			throw '未找到字符串插入分隔符';
		}
		if (isAfter) {
			arr[1] = insStr + arr[1];
		} else {
			arr[0] = arr[0] + insStr;
		}
		const newStr = arr.join(specifyStr);
		return newStr;
	},
	// 首字母大写
	firstLetter(str) {
		return str.replace(str[0], str[0].toUpperCase());
	}
};
module.exports = com;
