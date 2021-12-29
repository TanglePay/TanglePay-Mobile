import React from 'react';
import { TouchableOpacity } from 'react-native';
import IconFont from './icon';
import { ThemeVar } from '@/common/style/theme';
import { hitSlop } from '@/common/style/base.style';

export const SvgIcon = (props) => {
	const color = props.color || ThemeVar.textColor;
	if (!props.onPress) {
		return <IconFont {...props} color={color} />;
	}
	const keys = ['size', 'name', 'color'];
	const iconProps = {};
	const conProps = {};
	for (const k in props) {
		const value = props[k];
		if (keys.includes(k)) {
			iconProps[k] = value;
		} else {
			conProps[k] = value;
		}
	}
	return (
		<TouchableOpacity activeOpacity={0.8} hitSlop={hitSlop} {...conProps}>
			<IconFont {...iconProps} color={color} />
		</TouchableOpacity>
	);
};
