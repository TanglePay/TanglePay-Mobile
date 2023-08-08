/* eslint-disable */

import React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M13.25 10C13.25 11.7949 11.7949 13.25 10 13.25C8.20507 13.25 6.75 11.7949 6.75 10C6.75 8.20507 8.20507 6.75 10 6.75C11.7949 6.75 13.25 8.20507 13.25 10ZM4.75 10C4.75 11.1046 3.85457 12 2.75 12C1.64543 12 0.75 11.1046 0.75 10C0.75 8.89543 1.64543 8 2.75 8C3.85457 8 4.75 8.89543 4.75 10ZM17.25 12C18.3546 12 19.25 11.1046 19.25 10C19.25 8.89543 18.3546 8 17.25 8C16.1454 8 15.25 8.89543 15.25 10C15.25 11.1046 16.1454 12 17.25 12Z" fill="#191919"/>
</svg>
`

let Tool = ({ size, ...rest }) => {
  return (
    <SvgXml xml={xml}  width={size} height={size} {...rest} />
  );
};

Tool.defaultProps = {
  size: 18,
};

Tool = React.memo ? React.memo(Tool) : Tool;

export default Tool;
