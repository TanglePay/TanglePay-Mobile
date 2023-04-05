/* eslint-disable */

import React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16 14.1146L22.6 7.51465L24.4853 9.39998L17.8853 16L24.4853 22.6L22.6 24.4853L16 17.8853L9.39998 24.4853L7.51465 22.6L14.1146 16L7.51465 9.39998L9.39998 7.51465L16 14.1146Z" fill="currentColor"/>
</svg>
`

let Close = ({ size, color, ...rest }) => {
  return (
    <SvgXml xml={xml}  width={size} height={size} {...rest} />
  );
};

Close.defaultProps = {
  size: 18,
};

Close = React.memo ? React.memo(Close) : Close;

export default Close;
