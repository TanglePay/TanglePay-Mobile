/* eslint-disable */

import React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<mask id="mask0_3584_168" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
<rect width="24" height="24" fill="#D9D9D9"/>
</mask>
<g mask="url(#mask0_3584_168)">
<path d="M12 18.7059C12.3059 18.7059 12.5591 18.6061 12.7595 18.4066C12.9591 18.2061 13.0588 17.9529 13.0588 17.6471V13.0588H17.6471C17.9529 13.0588 18.2061 12.9586 18.4066 12.7581C18.6061 12.5586 18.7059 12.3059 18.7059 12C18.7059 11.6941 18.6061 11.4409 18.4066 11.2405C18.2061 11.0409 17.9529 10.9412 17.6471 10.9412H13.0588V6.35294C13.0588 6.04706 12.9591 5.79435 12.7595 5.59482C12.5591 5.39435 12.3059 5.29412 12 5.29412C11.6941 5.29412 11.4414 5.39435 11.2419 5.59482C11.0414 5.79435 10.9412 6.04706 10.9412 6.35294V10.9412H6.35294C6.04706 10.9412 5.79435 11.0409 5.59482 11.2405C5.39435 11.4409 5.29412 11.6941 5.29412 12C5.29412 12.3059 5.39435 12.5586 5.59482 12.7581C5.79435 12.9586 6.04706 13.0588 6.35294 13.0588H10.9412V17.6471C10.9412 17.9529 11.0414 18.2061 11.2419 18.4066C11.4414 18.6061 11.6941 18.7059 12 18.7059ZM2.54118 24C1.83529 24 1.23529 23.7529 0.741177 23.2588C0.247059 22.7647 0 22.1647 0 21.4588V2.54118C0 1.83529 0.247059 1.23529 0.741177 0.741177C1.23529 0.247059 1.83529 0 2.54118 0H21.4588C22.1647 0 22.7647 0.247059 23.2588 0.741177C23.7529 1.23529 24 1.83529 24 2.54118V21.4588C24 22.1647 23.7529 22.7647 23.2588 23.2588C22.7647 23.7529 22.1647 24 21.4588 24H2.54118ZM2.54118 21.8824H21.4588C21.5765 21.8824 21.6767 21.8414 21.7595 21.7595C21.8414 21.6767 21.8824 21.5765 21.8824 21.4588V2.54118C21.8824 2.42353 21.8414 2.32376 21.7595 2.24188C21.6767 2.15906 21.5765 2.11765 21.4588 2.11765H2.54118C2.42353 2.11765 2.32376 2.15906 2.24188 2.24188C2.15906 2.32376 2.11765 2.42353 2.11765 2.54118V21.4588C2.11765 21.5765 2.15906 21.6767 2.24188 21.7595C2.32376 21.8414 2.42353 21.8824 2.54118 21.8824Z" fill="#3671EE"/>
</g>
</svg>
`

let Add = ({ size, color, ...rest }) => {
  return (
    <SvgXml xml={xml}  width={size} height={size} {...rest} />
  );
};

Add.defaultProps = {
  size: 18,
};

Add = React.memo ? React.memo(Add) : Add;

export default Add;
