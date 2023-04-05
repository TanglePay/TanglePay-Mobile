/* eslint-disable */

import React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
<svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M21.454 0.626758C22.2125 1.42979 22.1763 2.69561 21.3732 3.45403L7.96017 15.7886L0.585786 8.41422C-0.195262 7.63317 -0.195262 6.36684 0.585786 5.58579C1.36683 4.80474 2.63317 4.80474 3.41421 5.58579L8.03983 10.2114L18.6268 0.545979C19.4298 -0.212445 20.6956 -0.176278 21.454 0.626758Z" fill="currentColor"/>
</svg>
`

let Select = ({ size, color, ...rest }) => {
  return (
    <SvgXml xml={xml}  width={size} height={size} {...rest} />
  );
};

Select.defaultProps = {
  size: 18,
};

Select = React.memo ? React.memo(Select) : Select;

export default Select;
