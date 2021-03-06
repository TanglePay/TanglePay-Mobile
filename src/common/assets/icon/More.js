/* eslint-disable */

import React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16 7C15.175 7 14.5 7.675 14.5 8.5C14.5 9.325 15.175 10 16 10C16.825 10 17.5 9.325 17.5 8.5C17.5 7.675 16.825 7 16 7ZM16 22C15.175 22 14.5 22.675 14.5 23.5C14.5 24.325 15.175 25 16 25C16.825 25 17.5 24.325 17.5 23.5C17.5 22.675 16.825 22 16 22ZM16 14.5C15.175 14.5 14.5 15.175 14.5 16C14.5 16.825 15.175 17.5 16 17.5C16.825 17.5 17.5 16.825 17.5 16C17.5 15.175 16.825 14.5 16 14.5Z" fill="currentColor"/>
</svg>
`

let More = ({ size, ...rest }) => {
  return (
    <SvgXml xml={xml}  width={size} height={size} {...rest} />
  );
};

More.defaultProps = {
  size: 18,
};

More = React.memo ? React.memo(More) : More;

export default More;
