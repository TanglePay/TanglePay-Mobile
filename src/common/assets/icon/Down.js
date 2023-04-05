/* eslint-disable */

import React from 'react';
import { SvgCss } from 'react-native-svg';

const xml = `
<svg t="1639834413023" class="icon" viewBox="0 0 1706 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5863" xmlns:xlink="http://www.w3.org/1999/xlink" width="106.625" height="64"><defs><style type="text/css"></style></defs><path d="M853.326222 1023.991467a73.386055 73.386055 0 0 1-26.794443-4.778627 85.332622 85.332622 0 0 1-22.186482-16.554529L77.14069 228.008767a63.316806 63.316806 0 0 1-20.138498-47.444938 63.14614 63.14614 0 0 1 8.533262-32.938393 61.951484 61.951484 0 0 1 24.063799-24.234464A64.340797 64.340797 0 0 1 168.958592 133.118891L853.326222 861.347489 1537.693853 133.118891a64.340797 64.340797 0 0 1 79.530003-9.727919c10.239915 5.802618 18.090516 13.99455 23.893135 24.234464a63.14614 63.14614 0 0 1 8.533262 32.938393 64.852793 64.852793 0 0 1-19.114507 47.444938l-728.399264 774.820209a79.700669 79.700669 0 0 1-23.039808 16.383864A66.04745 66.04745 0 0 1 853.326222 1023.991467z" p-id="5864" fill="currentColor"></path></svg>
`

let Down = ({ size, color, ...rest }) => {
  return (
    <SvgCss xml={xml}  width={size} height={size} {...rest} />
  );
};

Down.defaultProps = {
  size: 18,
};

Down = React.memo ? React.memo(Down) : Down;

export default Down;
