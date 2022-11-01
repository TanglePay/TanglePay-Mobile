/* eslint-disable */

import React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.33333 12.6433L15.9933 4.98248L17.1725 6.16082L8.33333 15L3.03 9.69665L4.20833 8.51832L8.33333 12.6433Z" fill="currentColor"/>
</svg>
`

let Tick = ({ size, ...rest }) => {
  return (
    <SvgXml xml={xml}  width={size} height={size} {...rest} />
  );
};

Tick.defaultProps = {
  size: 18,
};

Tick = React.memo ? React.memo(Tick) : Tick;

export default Tick;
