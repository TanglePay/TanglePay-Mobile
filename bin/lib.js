'use strict';
let fs = require('fs');
let path = require('path');
let com = {
	// get command line arguments
	get args() {
		let npm_config_argv = JSON.parse(process.env.npm_config_argv);
		return npm_config_argv.original.filter((e) => e !== 'run');
	},
	// get absolute path
	getPath(url) {
		return path.resolve('./', url);
	},
	// check file exists
	exists(path, isThrow) {
		path = this.getPath(path);
		const exists = fs.existsSync(path);
		if (isThrow && exists) {
			throw `-------File already exists-------${path}`;
		}
		return exists;
	},
	// create directory
	mkdir(path, isThrow) {
		path = this.getPath(path);
		const exists = this.exists(path, isThrow);
		if (!exists) {
			fs.mkdirSync(path);
		}
	},
	// insert string after isAfter index
	insStrIndex(oldStr, specifyStr, insStr, isAfter) {
		const arr = oldStr.split(specifyStr);
		if (arr.length !== 2) {
			throw 'delimiter not found';
		}
		if (isAfter) {
			arr[1] = insStr + arr[1];
		} else {
			arr[0] = arr[0] + insStr;
		}
		const newStr = arr.join(specifyStr);
		return newStr;
	},
	// Capitalize initials
	firstLetter(str) {
		return str.replace(str[0], str[0].toUpperCase());
	}
};
module.exports = com;
