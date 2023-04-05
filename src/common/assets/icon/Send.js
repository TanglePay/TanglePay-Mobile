/* eslint-disable */

import React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
<svg t="1671509344602" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6649" xmlns:xlink="http://www.w3.org/1999/xlink" width="128" height="128"><path d="M742.894933 200.7168L154.436267 299.3536a8.533333 8.533333 0 0 0-5.077334 13.960533L222.357333 398.72a17.066667 17.066667 0 0 0 19.1232 4.834133l503.658667-194.645333a4.266667 4.266667 0 0 0-2.24-8.192z m-110.024533 626.274133l240.042667-593.019733a8.533333 8.533333 0 0 0-11.191467-11.076267L302.762667 455.970133a12.8 12.8 0 0 0-4.5568 20.416l320.439466 353.1392a8.533333 8.533333 0 0 0 14.229334-2.5344z m-353.083733-3.861333c-14.677333 8.234667-33.211733 4.928-36.3008 4.548267-23.432533-2.875733-37.482667-24.2432-34.602667-47.68L192 470.634667l-86.724267-103.68c-31.965867-33.8688-30.318933-87.069867 3.677867-118.830934a84.561067 84.561067 0 0 1 47.4496-22.1184l691.464533-94.293333c46.3104-5.674667 88.520533 27.080533 94.280534 73.1648 1.9712 15.786667-0.597333 31.803733-7.406934 46.186667L700.599467 852.181333c-19.882667 41.984-70.225067 59.9296-112.443734 40.093867a84.625067 84.625067 0 0 1-25.553066-18.500267L409.079467 704.768c-0.849067 0.597333-43.946667 40.0512-129.2928 118.365867z m-21.3504-271.253333l10.2528 177.685333a8.533333 8.533333 0 0 0 14.528 5.568l71.057066-70.5152a17.066667 17.066667 0 0 0 0.9472-23.210667L273.442133 545.834667a8.533333 8.533333 0 0 0-15.005866 6.0416z" fill="currentColor" p-id="6650"></path></svg>
`

let Send = ({ size, color, ...rest }) => {
  return (
    <SvgXml xml={xml}  width={size} height={size} {...rest} />
  );
};

Send.defaultProps = {
  size: 18,
};

Send = React.memo ? React.memo(Send) : Send;

export default Send;
