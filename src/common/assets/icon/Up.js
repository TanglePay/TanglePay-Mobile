/* eslint-disable */

import React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
<svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.99999 3.02317L1.87499 7.14817L0.696655 5.96984L5.99999 0.666504L11.3033 5.96984L10.125 7.14817L5.99999 3.02317Z" fill="currentColor"/>
</svg>
`

let Up = ({ size, color, ...rest }) => {
  return (
    <SvgXml xml={xml}  width={size} height={size} {...rest} />
  );
};

Up.defaultProps = {
  size: 18,
};

Up = React.memo ? React.memo(Up) : Up;

export default Up;
