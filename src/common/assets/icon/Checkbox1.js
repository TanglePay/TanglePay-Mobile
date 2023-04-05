/* eslint-disable */

import React from 'react';
import { SvgCss } from 'react-native-svg';

const xml = `
<svg t="1639930125220" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12134" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64"><defs><style type="text/css"></style></defs><path d="M896 0H128C57.6 0 0 57.6 0 128v768c0 70.4 57.6 128 128 128h768c70.4 0 128-57.6 128-128V128c0-70.4-57.6-128-128-128zM448 794.496l-237.248-237.248 90.496-90.496L448 613.504l306.752-306.752 90.496 90.496L448 794.496z" p-id="12135" fill="currentColor"></path></svg>
`

let Checkbox1 = ({ size, color, ...rest }) => {
  return (
    <SvgCss xml={xml}  width={size} height={size} {...rest} />
  );
};

Checkbox1.defaultProps = {
  size: 18,
};

Checkbox1 = React.memo ? React.memo(Checkbox1) : Checkbox1;

export default Checkbox1;
