/* eslint-disable */

import React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11 7V11M11 11V15M11 11H15M11 11H7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
<path d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z" stroke="currentColor" stroke-width="1.5"/>
</svg>
`

let AddCircle = ({ size, ...rest }) => {
  return (
    <SvgXml xml={xml}  width={size} height={size} {...rest} />
  );
};

AddCircle.defaultProps = {
  size: 18,
};

AddCircle = React.memo ? React.memo(AddCircle) : AddCircle;

export default AddCircle;
