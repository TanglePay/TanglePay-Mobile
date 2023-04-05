/* eslint-disable */

import React from 'react';
import { SvgCss } from 'react-native-svg';

const xml = `
<svg t="1639930102104" class="icon" viewBox="0 0 1097 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12001" xmlns:xlink="http://www.w3.org/1999/xlink" width="68.5625" height="64"><defs><style type="text/css"></style></defs><path d="M865.426286 0h-614.4c-112.64 0-204.8 92.16-204.8 204.8v614.4c0 112.64 92.16 204.8 204.8 204.8h614.4c112.64 0 204.8-92.16 204.8-204.8V204.8c0-112.64-92.16-204.8-204.8-204.8m0 54.857143c82.651429 0 149.942857 67.291429 149.942857 149.942857v614.4c0 82.651429-67.291429 149.942857-149.942857 149.942857h-614.4c-82.651429 0-149.942857-67.291429-149.942857-149.942857V204.8c0-82.651429 67.291429-149.942857 149.942857-149.942857h614.4" p-id="12002" fill="currentColor"></path></svg>
`

let Checkbox0 = ({ size, color, ...rest }) => {
  return (
    <SvgCss xml={xml}  width={size} height={size} {...rest} />
  );
};

Checkbox0.defaultProps = {
  size: 18,
};

Checkbox0 = React.memo ? React.memo(Checkbox0) : Checkbox0;

export default Checkbox0;
