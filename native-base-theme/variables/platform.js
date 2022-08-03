// @flow

import color from 'color';
import { Platform, Dimensions, PixelRatio } from 'react-native';

import { PLATFORM } from './commonColor';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const platform = Platform.OS;
const platformStyle = undefined;
const isIphoneX =
	platform === PLATFORM.IOS &&
	(deviceHeight === 812 || deviceWidth === 812 || deviceHeight === 896 || deviceWidth === 896);
export default {
	platformStyle,
	platform,

	// Accordion
	accordionBorderColor: '#d3d3d3',
	accordionContentPadding: 10,
	accordionIconFontSize: 18,
	contentStyle: '#f5f5f5',
	expandedIconStyle: '#000',
	headerStyle: '#ededed',
	iconStyle: '#000',
	disableRow: '#a9a9a9',

	// ActionSheet
	elevation: 4,
	containerTouchableBackgroundColor: 'rgba(0,0,0,0.4)',
	innerTouchableBackgroundColor: '#fff',
	listItemHeight: 50,
	listItemBorderColor: 'transparent',
	marginHorizontal: -15,
	marginLeft: 14,
	marginTop: 15,
	minHeight: 56,
	padding: 15,
	touchableTextColor: '#757575',

	// Android
	androidRipple: true,
	androidRippleColor: 'rgba(256, 256, 256, 0.3)',
	androidRippleColorDark: 'rgba(0, 0, 0, 0.15)',
	buttonUppercaseAndroidText: false,

	// Badge
	badgeBg: '#ED1727',
	badgeColor: '#fff',
	badgePadding: 3,

	// Button
	buttonFontFamily: 'Open Sans',
	buttonDisabledBg: '#CBDCEC',
	buttonPadding: 6,
	buttonDefaultActiveOpacity: 0.5,
	buttonDefaultFlex: 1,
	buttonDefaultBorderRadius: 2,
	buttonDefaultBorderWidth: 1,
	get buttonPrimaryBg() {
		return this.brandPrimary;
	},
	get buttonPrimaryColor() {
		return this.inverseTextColor;
	},
	get buttonInfoBg() {
		return this.brandInfo;
	},
	get buttonInfoColor() {
		return this.inverseTextColor;
	},
	get buttonSuccessBg() {
		return this.brandSuccess;
	},
	get buttonSuccessColor() {
		return this.inverseTextColor;
	},
	get buttonDangerBg() {
		return this.brandDanger;
	},
	get buttonDangerColor() {
		return this.inverseTextColor;
	},
	get buttonWarningBg() {
		return this.brandWarning;
	},
	get buttonWarningColor() {
		return this.inverseTextColor;
	},
	get buttonTextSize() {
		return this.fontSizeBase;
	},
	get buttonTextSizeLarge() {
		return this.fontSizeBase * 1.5;
	},
	get buttonTextSizeSmall() {
		return this.fontSizeBase * 0.8;
	},
	get borderRadiusLarge() {
		return this.fontSizeBase * 3.8;
	},
	get iconSizeLarge() {
		return this.iconFontSize * 1.5;
	},
	get iconSizeSmall() {
		return this.iconFontSize * 0.6;
	},

	// Card
	cardDefaultBg: '#fff',
	cardBorderColor: '#ccc',
	cardBorderRadius: 2,
	cardItemPadding: 10,

	// CheckBox
	CheckboxRadius: 13,
	CheckboxBorderWidth: 1,
	CheckboxPaddingLeft: 4,
	CheckboxPaddingBottom: 0,
	CheckboxIconSize: 19,
	CheckboxIconMarginTop: undefined,
	CheckboxFontSize: 12,
	checkboxBgColor: '#3671ee',
	checkboxSize: 20,
	checkboxTickColor: '#fff',
	checkboxDefaultColor: 'transparent',
	checkboxTextShadowRadius: 0,

	// Color
	brandPrimary: '#3671ee',
	brandInfo: '#62B1F6',
	brandSuccess: '#5cb85c',
	brandDanger: '#d9534f',
	brandWarning: '#f0ad4e',
	brandDark: '#000',
	brandLight: '#F2F2F2',

	// Container
	containerBgColor: '#fff',
	secondBgColor: '#F2F2F2',

	// Date Picker
	datePickerFlex: 1,
	datePickerPadding: 10,
	datePickerTextColor: '#000',
	datePickerBg: 'transparent',

	// FAB
	fabBackgroundColor: 'blue',
	fabBorderRadius: 28,
	fabBottom: 0,
	fabButtonBorderRadius: 20,
	fabButtonHeight: 40,
	fabButtonLeft: 7,
	fabButtonMarginBottom: 10,
	fabContainerBottom: 20,
	fabDefaultPosition: 20,
	fabElevation: 4,
	fabIconColor: '#fff',
	fabIconSize: 24,
	fabShadowColor: '#000',
	fabShadowOffsetHeight: 2,
	fabShadowOffsetWidth: 0,
	fabShadowOpacity: 0.4,
	fabShadowRadius: 2,
	fabWidth: 56,

	// Font
	DefaultFontSize: 16,
	fontFamily: 'System',
	fontSizeBase: 15,
	get fontSizeH1() {
		return this.fontSizeBase * 1.8;
	},
	get fontSizeH2() {
		return this.fontSizeBase * 1.6;
	},
	get fontSizeH3() {
		return this.fontSizeBase * 1.4;
	},

	// Footer
	footerHeight: 55,
	footerDefaultBg: '#F8F8F8',
	footerPaddingBottom: 0,

	// FooterTab
	tabBarTextColor: '#6b6b6b',
	tabBarTextSize: 14,
	activeTab: '#3671ee',
	sTabBarActiveTextColor: '#3671ee',
	tabBarActiveTextColor: '#3671ee',
	tabActiveBgColor: '#fff',

	// Header
	toolbarBtnColor: '#3671ee',
	toolbarDefaultBg: '#fff',
	toolbarHeight: platform === PLATFORM.IOS ? 64 : 56,
	toolbarSearchIconSize: 23,
	toolbarInputColor: '#CECDD2',
	searchBarHeight: platform === PLATFORM.IOS ? 30 : 40,
	searchBarInputHeight: platform === PLATFORM.IOS ? 30 : 50,
	toolbarBtnTextColor: '#3671ee',
	toolbarDefaultBorder: '#a7a6ab',
	iosStatusbar: 'dark-content',
	get statusBarColor() {
		return color(this.toolbarDefaultBg).darken(0).hex();
	},
	get darkenHeader() {
		return color(this.tabBgColor).darken(0.03).hex();
	},

	// Icon
	iconFamily: 'Ionicons',
	iconFontSize: 30,
	iconHeaderSize: 33,

	// InputGroup
	inputFontSize: 17,
	inputBorderColor: '#D9D5DC',
	inputSuccessBorderColor: '#2b8339',
	inputErrorBorderColor: '#ed2f2f',
	inputHeightBase: 50,
	get inputColor() {
		return this.textColor;
	},
	get inputColorPlaceholder() {
		return '#999';
	},

	// Line Height
	buttonLineHeight: 19,
	lineHeightH1: 32,
	lineHeightH2: 27,
	lineHeightH3: 25,
	lineHeight: 20,
	listItemSelected: '#3671ee',

	// List
	listBg: 'transparent',
	listBorderColor: '#c9c9c9',
	listDividerBg: '#f4f4f4',
	listBtnUnderlayColor: '#DDD',
	listItemPadding: 10,
	listNoteColor: '#808080',
	listNoteSize: 13,

	// Progress Bar
	defaultProgressColor: '#E4202D',
	inverseProgressColor: '#1A191B',

	// Radio Button
	radioBtnSize: 25,
	radioSelectedColorAndroid: '#3671ee',
	radioBtnLineHeight: 29,
	get radioColor() {
		return this.brandPrimary;
	},

	// Segment
	segmentBackgroundColor: '#F8F8F8',
	segmentActiveBackgroundColor: '#3671ee',
	segmentTextColor: '#3671ee',
	segmentActiveTextColor: '#fff',
	segmentBorderColor: '#3671ee',
	segmentBorderColorMain: '#a7a6ab',

	// Spinner
	defaultSpinnerColor: '#45D56E',
	inverseSpinnerColor: '#1A191B',

	// Tab
	tabBarDisabledTextColor: '#BDBDBD',
	tabDefaultBg: '#F8F8F8',
	topTabBarTextColor: '#6b6b6b',
	topTabBarActiveTextColor: '#3671ee',
	topTabBarBorderColor: '#a7a6ab',
	topTabBarActiveBorderColor: '#3671ee',

	// Tabs
	tabBgColor: '#F8F8F8',
	tabFontSize: 15,

	// Text
	textColor: '#000',
	secondTextColor: '#777',
	inverseTextColor: '#fff',
	noteFontSize: 14,
	get defaultTextColor() {
		return this.textColor;
	},

	// Title
	titleFontfamily: 'Open Sans',
	titleFontSize: 17,
	subTitleFontSize: 11,
	subtitleColor: '#8e8e93',
	titleFontColor: '#000',

	// Other
	borderRadiusBase: 5,
	borderWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
	contentPadding: 10,
	dropdownLinkColor: '#414142',
	inputLineHeight: 24,
	deviceWidth,
	deviceHeight,
	nav1ToolbarTop: 60,
	get contentHeight() {
		return this.deviceHeight - this.toolbarHeight;
	},
	// 使用nav1时的内容区域高度
	get contentHeight1() {
		return this.deviceHeight - this.toolbarHeight - this.nav1ToolbarTop;
	},
	isIphoneX,
	inputGroupRoundedBorderRadius: 30,

	// iPhoneX SafeArea
	Inset: {
		portrait: {
			topInset: 24,
			leftInset: 0,
			rightInset: 0,
			bottomInset: 34
		},
		landscape: {
			topInset: 0,
			leftInset: 44,
			rightInset: 44,
			bottomInset: 21
		}
	}
};
