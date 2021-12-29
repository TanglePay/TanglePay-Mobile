import React from 'react';
import { View, Text } from 'react-native';
import { ThemeVar } from '@/common/style/theme';
import { SvgIcon } from '@/common/assets';

export const NoData = ({ label, img, style = {} }) => {
	img = img || 'noData';
	return (
		<View style={[{ width: '100%', padding: 30, alignItems: 'center' }, style]}>
			<SvgIcon size={120} name={img} color={ThemeVar.secondTextColor} />
			{label && <Text style={{ fontSize: 15, marginTop: 30 }}>{label}</Text>}
		</View>
	);
};
