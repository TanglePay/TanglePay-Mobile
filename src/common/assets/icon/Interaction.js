/* eslint-disable */

import React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="4.75" y="4.75" width="22.5" height="22.5" rx="3.25" stroke="black" stroke-width="1.5"/>
<path d="M10 14L22 14" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
<path d="M22 18L10 18" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
<path d="M18 10L22 14" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
<path d="M14 22L10 18" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
</svg>
`

let Interaction = ({ size, ...rest }) => {
  return (
    <SvgXml xml={xml}  width={size} height={size} {...rest} />
  );
};

Interaction.defaultProps = {
  size: 18,
};

Interaction = React.memo ? React.memo(Interaction) : Interaction;

export default Interaction;
