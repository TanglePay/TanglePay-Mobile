/* eslint-disable */

import React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
<svg t="1639928605135" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6318" fill="currentColor" width="64" height="64"><path d="M639.9 256.3H192.4c-35.2 0-63.9 28.8-63.9 63.9v575.4c0 35.2 28.8 63.9 63.9 63.9h447.5c35.2 0 63.9-28.8 63.9-63.9V320.2c0-35.1-28.8-63.9-63.9-63.9z m0 639.3H192.4V320.2h447.5v575.4z" p-id="6319"></path><path d="M831.6 64.5H384.1c-35.2 0-63.9 28.8-63.9 63.9v63.9h63.9v-63.9h447.5v575.4h-63.9v63.9h63.9c35.2 0 63.9-28.8 63.9-63.9V128.4c0.1-35.1-28.7-63.9-63.9-63.9z" p-id="6320" fill="currentColor"></path></svg>
`

let Copy = ({ size, ...rest }) => {
  return (
    <SvgXml xml={xml}  width={size} height={size} {...rest} />
  );
};

Copy.defaultProps = {
  size: 18,
};

Copy = React.memo ? React.memo(Copy) : Copy;

export default Copy;
