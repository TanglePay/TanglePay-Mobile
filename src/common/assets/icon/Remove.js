/* eslint-disable */

import React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.83335 3.33335V1.66669H14.1667V3.33335H18.3334V5.00002H16.6667V17.5C16.6667 17.721 16.5789 17.933 16.4226 18.0893C16.2663 18.2456 16.0544 18.3334 15.8334 18.3334H4.16669C3.94567 18.3334 3.73371 18.2456 3.57743 18.0893C3.42115 17.933 3.33335 17.721 3.33335 17.5V5.00002H1.66669V3.33335H5.83335ZM5.00002 5.00002V16.6667H15V5.00002H5.00002ZM7.50002 7.50002H9.16669V14.1667H7.50002V7.50002ZM10.8334 7.50002H12.5V14.1667H10.8334V7.50002Z" fill="currentColor"/>
</svg>
`

let Remove = ({ size, color, ...rest }) => {
  return (
    <SvgXml xml={xml}  width={size} height={size} {...rest} />
  );
};

Remove.defaultProps = {
  size: 18,
};

Remove = React.memo ? React.memo(Remove) : Remove;

export default Remove;
