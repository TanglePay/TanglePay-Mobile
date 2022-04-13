/* eslint-disable */

import React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.1406 21H12.8679C13.1701 21 13.4238 20.9173 13.629 20.7519C13.8399 20.5865 13.9796 20.3527 14.048 20.0504L14.4242 18.4078L14.8347 18.2624L16.2713 19.1521C16.5278 19.3175 16.79 19.3831 17.058 19.3489C17.3259 19.3146 17.5653 19.192 17.7762 18.981L18.9819 17.7833C19.1986 17.5665 19.3211 17.3241 19.3496 17.0561C19.3838 16.788 19.3211 16.5257 19.1615 16.269L18.2551 14.8403L18.409 14.4468L20.0508 14.0532C20.3473 13.9848 20.5781 13.8451 20.7435 13.634C20.9145 13.423 21 13.1692 21 12.8726V11.1702C21 10.8679 20.9145 10.6141 20.7435 10.4087C20.5781 10.1977 20.3473 10.0551 20.0508 9.98099L18.4176 9.59601L18.2551 9.17681L19.1615 7.7481C19.3268 7.49715 19.3924 7.23764 19.3582 6.96958C19.324 6.70152 19.2014 6.45913 18.9905 6.2424L17.7848 5.03612C17.5739 4.8308 17.3344 4.71103 17.0665 4.67681C16.7986 4.64259 16.5392 4.70532 16.2884 4.86502L14.8518 5.76331L14.4242 5.60076L14.048 3.94962C13.9796 3.65304 13.8399 3.42205 13.629 3.25665C13.4238 3.08555 13.1701 3 12.8679 3H11.1406C10.8385 3 10.5819 3.08555 10.371 3.25665C10.1601 3.42205 10.0204 3.65304 9.95202 3.94962L9.56722 5.60076L9.14822 5.76331L7.71164 4.86502C7.45511 4.70532 7.19287 4.64259 6.92494 4.67681C6.66271 4.71103 6.42328 4.8308 6.20665 5.03612L5.0095 6.2424C4.79287 6.45913 4.66746 6.70152 4.63325 6.96958C4.60475 7.23764 4.67316 7.49715 4.83848 7.7481L5.73634 9.17681L5.58242 9.59601L3.94917 9.98099C3.64703 10.0551 3.4133 10.1977 3.24798 10.4087C3.08266 10.6141 3 10.8679 3 11.1702V12.8726C3 13.1692 3.08266 13.423 3.24798 13.634C3.419 13.8451 3.65273 13.9848 3.94917 14.0532L5.59097 14.4468L5.73634 14.8403L4.83848 16.269C4.67886 16.5257 4.6133 16.788 4.64181 17.0561C4.67031 17.3241 4.79572 17.5665 5.01805 17.7833L6.2152 18.981C6.42613 19.192 6.66556 19.3146 6.93349 19.3489C7.20713 19.3831 7.47221 19.3175 7.72874 19.1521L9.15677 18.2624L9.56722 18.4078L9.95202 20.0504C10.0204 20.3527 10.1601 20.5865 10.371 20.7519C10.5819 20.9173 10.8385 21 11.1406 21ZM11.2518 19.9819C11.0523 19.9819 10.9325 19.885 10.8926 19.6911L10.4052 17.6122C10.1658 17.5494 9.93777 17.4753 9.72114 17.3897C9.50451 17.2985 9.30784 17.2044 9.13112 17.1074L7.31829 18.2367C7.16437 18.3451 7.01045 18.3251 6.85653 18.1768L5.8133 17.1331C5.67648 16.9962 5.65938 16.8422 5.762 16.6711L6.89074 14.866C6.80523 14.6892 6.71686 14.4952 6.62565 14.2842C6.53444 14.0675 6.45748 13.8422 6.39477 13.6084L4.30831 13.1207C4.12019 13.0808 4.02613 12.961 4.02613 12.7614V11.2728C4.02613 11.0789 4.12019 10.9591 4.30831 10.9135L6.38622 10.4259C6.44893 10.1806 6.52874 9.94962 6.62565 9.73289C6.72257 9.51046 6.80523 9.31939 6.87363 9.1597L5.75344 7.35456C5.65083 7.17776 5.66508 7.02091 5.7962 6.88403L6.84798 5.84886C6.9962 5.70627 7.15297 5.68631 7.31829 5.78897L9.12257 6.90114C9.29929 6.80989 9.49881 6.71863 9.72114 6.62738C9.94917 6.53612 10.1772 6.45913 10.4052 6.39639L10.8926 4.31749C10.9325 4.12357 11.0523 4.02662 11.2518 4.02662H12.7568C12.9563 4.02662 13.0732 4.12357 13.1074 4.31749L13.6033 6.40494C13.8428 6.47338 14.0679 6.55323 14.2789 6.64449C14.4955 6.73004 14.6893 6.81844 14.8603 6.9097L16.6732 5.78897C16.8442 5.68631 17.0038 5.70627 17.152 5.84886L18.1952 6.88403C18.3321 7.02091 18.3463 7.17776 18.238 7.35456L17.1178 9.1597C17.1919 9.31939 17.2774 9.5076 17.3743 9.72433C17.4713 9.94106 17.5511 10.1749 17.6138 10.4259L19.6917 10.9135C19.8855 10.9591 19.9824 11.0789 19.9824 11.2728V12.7614C19.9824 12.961 19.8855 13.0808 19.6917 13.1207L17.6052 13.6084C17.5425 13.8422 17.4656 14.0675 17.3743 14.2842C17.2888 14.4952 17.2005 14.6892 17.1093 14.866L18.2295 16.6711C18.3378 16.8422 18.3235 16.9962 18.1867 17.1331L17.1435 18.1768C16.9895 18.3251 16.8328 18.3451 16.6732 18.2367L14.8603 17.1074C14.6893 17.2044 14.4955 17.2985 14.2789 17.3897C14.0622 17.4753 13.8371 17.5494 13.6033 17.6122L13.1074 19.6911C13.0732 19.885 12.9563 19.9819 12.7568 19.9819H11.2518ZM12.0043 15.2766C12.6028 15.2766 13.1473 15.1283 13.6375 14.8317C14.1335 14.5352 14.5297 14.1388 14.8261 13.6426C15.1226 13.1464 15.2708 12.5989 15.2708 12C15.2708 11.4068 15.1226 10.865 14.8261 10.3745C14.5297 9.87833 14.1335 9.48194 13.6375 9.18536C13.1473 8.88878 12.6028 8.74049 12.0043 8.74049C11.4057 8.74049 10.8584 8.88878 10.3625 9.18536C9.87221 9.48194 9.47601 9.87833 9.17387 10.3745C8.87743 10.865 8.72922 11.4068 8.72922 12C8.72922 12.5989 8.87743 13.1464 9.17387 13.6426C9.47031 14.1388 9.86651 14.5352 10.3625 14.8317C10.8584 15.1283 11.4057 15.2766 12.0043 15.2766ZM12.0043 14.2586C11.5938 14.2586 11.2176 14.1559 10.8755 13.9506C10.5392 13.7452 10.2684 13.4715 10.0632 13.1293C9.85796 12.7871 9.75534 12.4106 9.75534 12C9.75534 11.5951 9.85796 11.2243 10.0632 10.8878C10.2684 10.5456 10.542 10.2719 10.8841 10.0665C11.2261 9.86122 11.5995 9.75855 12.0043 9.75855C12.409 9.75855 12.7796 9.86122 13.1159 10.0665C13.458 10.2719 13.7287 10.5456 13.9283 10.8878C14.1335 11.2243 14.2361 11.5951 14.2361 12C14.2361 12.4106 14.1335 12.7871 13.9283 13.1293C13.7287 13.4658 13.458 13.7395 13.1159 13.9506C12.7796 14.1559 12.409 14.2586 12.0043 14.2586Z" fill="currentColor"/>
</svg>
`

let Set = ({ size, ...rest }) => {
  return (
    <SvgXml xml={xml}  width={size} height={size} {...rest} />
  );
};

Set.defaultProps = {
  size: 18,
};

Set = React.memo ? React.memo(Set) : Set;

export default Set;