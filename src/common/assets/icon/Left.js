/* eslint-disable */

import React from 'react';
import { SvgCss } from 'react-native-svg';

const xml = `
<svg t="1639834427764" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5991" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64"><defs><style type="text/css"></style></defs><path d="M219.426377 512.004389c0 6.143947 1.023991 11.922184 3.145116 17.261566a54.856673 54.856673 0 0 0 10.532481 14.11645l498.025446 467.67142a40.740222 40.740222 0 0 0 30.50031 12.946175 40.66708 40.66708 0 0 0 21.211246-5.558809c6.582801-3.657112 11.702757-8.777068 15.506153-15.359869A37.595106 37.595106 0 0 0 804.564219 981.504364a41.398502 41.398502 0 0 0-12.434179-29.476319L324.019766 512.004389 792.13004 71.980732A41.398502 41.398502 0 0 0 804.564219 42.504413a37.595106 37.595106 0 0 0-6.21709-21.576958 39.862515 39.862515 0 0 0-15.579295-15.359868 40.66708 40.66708 0 0 0-21.211247-5.55881 41.691071 41.691071 0 0 0-30.427167 12.287895L233.103974 480.626372a51.199561 51.199561 0 0 0-10.532481 14.77473A42.422494 42.422494 0 0 0 219.426377 512.004389z" p-id="5992" fill="currentColor"></path></svg>
`

let Left = ({ size, color, ...rest }) => {
  return (
    <SvgCss xml={xml}  width={size} height={size} {...rest} />
  );
};

Left.defaultProps = {
  size: 18,
};

Left = React.memo ? React.memo(Left) : Left;

export default Left;
