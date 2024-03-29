/* eslint-disable */

import React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
<svg t="1672476106452" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6416" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M512 0c-282.784 0-512 229.216-512 512s229.216 512 512 512 512-229.216 512-512-229.216-512-512-512zM512 896c-212.064 0-384-171.936-384-384s171.936-384 384-384c212.064 0 384 171.936 384 384s-171.936 384-384 384zM320 512c0-106.048 85.952-192 192-192s192 85.952 192 192c0 106.048-85.952 192-192 192s-192-85.952-192-192z" fill="currentColor" p-id="6417"></path></svg>
`

let Radio = ({ size, ...rest }) => {
  return (
    <SvgXml xml={xml}  width={size} height={size} {...rest} />
  );
};

Radio.defaultProps = {
  size: 18,
};

Radio = React.memo ? React.memo(Radio) : Radio;

export default Radio;
