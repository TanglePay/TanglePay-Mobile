/* eslint-disable */

import React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
<svg width="60" height="61" viewBox="0 0 60 61" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect y="0.5" width="60" height="60" rx="8" fill="white"/>
<path d="M46 28.4701C45.5109 24.9506 43.8781 21.6894 41.3533 19.1891C38.8284 16.6888 35.5515 15.088 32.0273 14.6332C28.5032 14.1785 24.9272 14.8951 21.8504 16.6726C18.7736 18.4501 16.3665 21.19 15 24.4701M14 16.4701V24.4701H22" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14 32.4702C14.4891 35.9898 16.1219 39.2509 18.6467 41.7512C21.1716 44.2516 24.4485 45.8524 27.9727 46.3071C31.4968 46.7618 35.0728 46.0453 38.1496 44.2677C41.2264 42.4902 43.6335 39.7503 45 36.4702M46 44.4702V36.4702H38" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`

let Refresh = ({ size, ...rest }) => {
  return (
    <SvgXml xml={xml}  width={size} height={size} {...rest} />
  );
};

Refresh.defaultProps = {
  size: 18,
};

Refresh = React.memo ? React.memo(Refresh) : Refresh;

export default Refresh;
