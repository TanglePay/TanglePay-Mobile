'use strict';
const lib = require('./lib');
const inquirer = require('inquirer');
let fs = require('fs');

const CREATE_QUESTIONS = [
	{
		type: 'list',
		name: 'type',
		message: '选择模板类型',
		choices: [
			{
				name: '页面',
				value: 'panel'
			},
			{
				name: 'store',
				value: 'store'
			}
		]
	}
];
const PANEL_CREATE_QUESTIONS = [
	{
		type: 'input',
		message: '请输入文件路径【模块名/页面名】如(member/memberManager)：',
		name: 'fileUrl'
	},
	{
		type: 'input',
		message: '请输入页面名称如(用户管理)：',
		name: 'viewName'
	}
];
const STORE_CREATE_QUESTIONS = [
	{
		type: 'input',
		message: '请输入store名称如(common)：',
		name: 'fileUrl'
	}
];
const QUESTIONS = {
	panel: PANEL_CREATE_QUESTIONS,
	store: STORE_CREATE_QUESTIONS
};
const getRouterTemplate = (fileUrl, componentName) => {
	return `
	{
        path:"${fileUrl}",
        component:${componentName},
    },`;
};
const getRouterImportTemplate = (fileUrl, componentName) => {
	return `import { ${componentName} } from './${fileUrl}';\n`;
};
(async () => {
	const typeAnswers = await inquirer.prompt(CREATE_QUESTIONS);
	const { type } = typeAnswers;
	const answers = await inquirer.prompt(QUESTIONS[type]);
	let { fileUrl, viewName } = answers;
	const temUrl = lib.getPath(`./bin/template/${type}.js`);
	switch (type) {
		case 'panel':
			if (!fileUrl) throw 'no input file';
			fileUrl = fileUrl.replace(/( |^\/|\/$)/g, '');
			const urlArr = fileUrl.split('/');
			const componentName = urlArr.map(lib.firstLetter).join('');
			let content = fs.readFileSync(temUrl, 'utf-8');
			content = content.replace(/页面名称/g, viewName).replace(/组件名称/, componentName);

			const viewsPath = './src/panels/';
			let dirUrl = viewsPath;
			let path = lib.getPath(`${viewsPath}/${fileUrl}/index.js`);
			urlArr.forEach((e) => {
				lib.mkdir(`${dirUrl}${e}`);
				dirUrl += `${e}/`;
			});
			lib.exists(path, true);
			fs.writeFileSync(path, content, { encoding: 'utf-8' });

			const routerPath = lib.getPath(`${viewsPath}index.js`);
			let routerContent = fs.readFileSync(routerPath, 'utf-8');
			routerContent = lib.insStrIndex(
				routerContent,
				'export const panelsList = [',
				getRouterImportTemplate(fileUrl, componentName)
			);
			routerContent = lib.insStrIndex(
				routerContent,
				'export const panelsList = [',
				getRouterTemplate(fileUrl, componentName),
				true
			);
			fs.writeFileSync(routerPath, routerContent, { encoding: 'utf-8' });
			break;
		case 'store':
			const storePath = `src/store/${fileUrl}.js`;
			lib.exists(storePath, true);
			const storeTemContent = fs.readFileSync(temUrl, { encoding: 'utf8' });
			fs.writeFileSync(storePath, storeTemContent, 'utf8');
			const storeClassName = `${lib.firstLetter(fileUrl)}Store`;
			const storeIndexPath = 'src/store/index.js';
			let storeIndexContent = fs.readFileSync(storeIndexPath, 'utf-8');
			storeIndexContent = lib.insStrIndex(
				storeIndexContent,
				`import { get } from 'lodash'`,
				`import * as ${storeClassName} from './${fileUrl}';\n`
			);
			storeIndexContent = lib.insStrIndex(
				storeIndexContent,
				`const stores = {`,
				`\n    ${fileUrl}: ${storeClassName},`,
				true
			);
			fs.writeFileSync(storeIndexPath, storeIndexContent);
			break;
	}
})();
