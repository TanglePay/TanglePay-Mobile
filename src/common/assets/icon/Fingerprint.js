/* eslint-disable */

import React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
<svg width="17" height="19" viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.287469 7.92514C0.154926 7.83678 0.0665646 7.71896 0.0223838 7.57169C-0.021797 7.42442 0.0076568 7.27715 0.110745 7.12988C1.00909 5.83391 2.15425 4.82865 3.54624 4.1141C4.93765 3.40014 6.42124 3.04316 7.99702 3.04316C9.55807 3.04316 11.0308 3.38188 12.4151 4.05932C13.7994 4.73676 14.9408 5.70873 15.8391 6.97525C15.9864 7.1667 16.0341 7.33606 15.9823 7.48333C15.931 7.6306 15.8465 7.75578 15.7287 7.85887C15.5961 7.94723 15.4524 7.98405 15.2975 7.96932C15.1431 7.95459 15.0144 7.87359 14.9113 7.72632C14.1455 6.59235 13.1479 5.73083 11.9185 5.14175C10.6885 4.55267 9.38135 4.25077 7.99702 4.23604C6.62741 4.23604 5.33527 4.53441 4.1206 5.13114C2.90533 5.72729 1.9148 6.59235 1.14899 7.72632C1.01645 7.90305 0.869183 7.99877 0.707186 8.0135C0.54519 8.02823 0.405284 7.99877 0.287469 7.92514ZM10.6479 18.882C8.95427 18.5138 7.62531 17.7333 6.66099 16.5404C5.69608 15.3475 5.21363 13.9116 5.21363 12.2328C5.21363 11.4522 5.48608 10.7895 6.03097 10.2446C6.57587 9.69973 7.23858 9.42729 8.01911 9.42729C8.78491 9.42729 9.44379 9.69237 9.99576 10.2225C10.5483 10.7527 10.8246 11.4007 10.8246 12.1665C10.8246 12.6083 10.9828 12.9877 11.2991 13.3046C11.616 13.6209 11.9954 13.7791 12.4372 13.7791C12.8937 13.7791 13.2766 13.6209 13.5859 13.3046C13.8952 12.9877 14.0498 12.6083 14.0498 12.1665C14.0498 10.5318 13.4572 9.15101 12.272 8.0241C11.0861 6.89779 9.66853 6.33463 8.01911 6.33463C6.35497 6.33463 4.93765 6.90515 3.76715 8.04619C2.59606 9.18783 2.01052 10.5834 2.01052 12.2328C2.01052 12.7335 2.04734 13.2342 2.12097 13.7349C2.19461 14.2356 2.32715 14.7584 2.5186 15.3033C2.57751 15.4801 2.57397 15.6385 2.508 15.7787C2.44143 15.9183 2.33451 16.0176 2.18724 16.0765C2.01052 16.1501 1.85235 16.1501 1.71274 16.0765C1.57254 16.0029 1.46562 15.8777 1.39199 15.701C1.20054 15.215 1.0571 14.6848 0.961668 14.1105C0.865648 13.5361 0.817638 12.9102 0.817638 12.2328C0.817638 10.2446 1.51717 8.56576 2.91623 7.19615C4.31529 5.82655 6.00888 5.14175 7.99702 5.14175C9.99988 5.14175 11.7047 5.81919 13.1114 7.17406C14.5175 8.52894 15.2206 10.1931 15.2206 12.1665C15.2206 12.947 14.9517 13.6059 14.4138 14.1431C13.8766 14.681 13.2177 14.9499 12.4372 14.9499C11.6714 14.9499 11.0125 14.6922 10.4605 14.1767C9.90799 13.6613 9.63171 13.0133 9.63171 12.2328C9.63171 11.791 9.47354 11.4119 9.15721 11.0956C8.84028 10.7786 8.46092 10.6202 8.01911 10.6202C7.56257 10.6202 7.17967 10.7786 6.87041 11.0956C6.56114 11.4119 6.40651 11.791 6.40651 12.2328C6.40651 13.6466 6.80414 14.8321 7.59939 15.7893C8.39465 16.7466 9.52862 17.3946 11.0013 17.7333C11.1633 17.7627 11.2776 17.8476 11.3442 17.9878C11.4101 18.1274 11.421 18.2708 11.3769 18.4181C11.3474 18.5506 11.2738 18.6684 11.1559 18.7715C11.0381 18.8746 10.8688 18.9114 10.6479 18.882ZM3.11504 3.30824C2.95304 3.41133 2.79105 3.44432 2.62905 3.40721C2.46706 3.37069 2.34188 3.27143 2.25351 3.10943C2.17988 2.97689 2.16898 2.83315 2.22082 2.67823C2.27207 2.52389 2.37133 2.40254 2.5186 2.31418C3.35803 1.82819 4.24165 1.47091 5.16945 1.24235C6.09725 1.01438 7.04713 0.900391 8.01911 0.900391C8.97636 0.900391 9.90799 1.01438 10.814 1.24235C11.7194 1.47091 12.5992 1.8061 13.4533 2.24791C13.6301 2.35099 13.737 2.47617 13.7741 2.62344C13.8106 2.77071 13.7921 2.91062 13.7184 3.04316C13.6595 3.1757 13.5564 3.27879 13.4092 3.35243C13.2619 3.42606 13.0999 3.41133 12.9232 3.30824C12.1574 2.91062 11.3621 2.60872 10.5374 2.40254C9.71271 2.19636 8.87327 2.09327 8.01911 2.09327C7.16495 2.09327 6.32198 2.19253 5.4902 2.39105C4.65783 2.59016 3.86611 2.89589 3.11504 3.30824ZM5.58917 18.4623C4.72028 17.5639 4.07612 16.6214 3.6567 15.6347C3.23668 14.648 3.02668 13.514 3.02668 12.2328C3.02668 10.8632 3.51267 9.69591 4.48465 8.731C5.45662 7.76668 6.63478 7.28452 8.01911 7.28452C9.38871 7.28452 10.5669 7.75578 11.5536 8.6983C12.5403 9.64083 13.0336 10.7969 13.0336 12.1665C13.0336 12.3579 12.9821 12.5164 12.879 12.6419C12.7759 12.7668 12.6286 12.8292 12.4372 12.8292C12.2605 12.8292 12.117 12.7668 12.0069 12.6419C11.8961 12.5164 11.8407 12.3579 11.8407 12.1665C11.8407 11.1356 11.4652 10.2594 10.7141 9.53774C9.96306 8.81612 9.06472 8.45531 8.01911 8.45531C6.95877 8.45531 6.0566 8.82348 5.31259 9.55983C4.56918 10.2962 4.19747 11.1872 4.19747 12.2328C4.19747 13.3667 4.37802 14.3461 4.73913 15.1708C5.09964 15.9955 5.67753 16.8276 6.47278 17.667C6.5906 17.7848 6.65333 17.9209 6.66099 18.0752C6.66806 18.2302 6.62005 18.3665 6.51696 18.4844C6.39915 18.6169 6.24834 18.6758 6.06455 18.6611C5.88017 18.6463 5.72171 18.5801 5.58917 18.4623ZM12.5256 17.0485C11.1265 17.0485 9.92271 16.6176 8.91421 15.7557C7.90512 14.8945 7.40058 13.7055 7.40058 12.1886C7.40058 12.0266 7.45566 11.8831 7.56581 11.7583C7.67656 11.6328 7.8203 11.5701 7.99702 11.5701C8.18847 11.5701 8.33574 11.6328 8.43883 11.7583C8.54192 11.8831 8.59346 12.0266 8.59346 12.1886C8.59346 13.3667 8.98019 14.2724 9.75365 14.9057C10.5265 15.539 11.4505 15.8556 12.5256 15.8556C12.6581 15.8556 12.8092 15.8447 12.9788 15.8229C13.1479 15.8005 13.3208 15.782 13.4975 15.7672C13.6595 15.7525 13.7994 15.7929 13.9172 15.8883C14.0351 15.9843 14.1013 16.1133 14.1161 16.2753C14.1308 16.4373 14.094 16.5698 14.0056 16.6729C13.9172 16.776 13.8068 16.8497 13.6743 16.8938C13.4386 16.9675 13.2177 17.0117 13.0115 17.0264C12.8054 17.0411 12.6434 17.0485 12.5256 17.0485Z" fill="currentColor"/>
</svg>
`

let Fingerprint = ({ size, color, ...rest }) => {
  return (
    <SvgXml xml={xml}  width={size} height={size} {...rest} />
  );
};

Fingerprint.defaultProps = {
  size: 18,
};

Fingerprint = React.memo ? React.memo(Fingerprint) : Fingerprint;

export default Fingerprint;
