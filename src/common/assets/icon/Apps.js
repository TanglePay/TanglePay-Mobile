/* eslint-disable */

import React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.25 21.6666C12.7071 21.6666 14.0771 21.3878 15.3598 20.83C16.6496 20.2723 17.786 19.5019 18.769 18.5189C19.752 17.5359 20.5224 16.403 21.0801 15.1202C21.6378 13.8305 21.9167 12.4571 21.9167 11C21.9167 9.5429 21.6378 8.17296 21.0801 6.89018C20.5224 5.60042 19.752 4.46403 18.769 3.48103C17.786 2.49802 16.6496 1.72765 15.3598 1.16991C14.0701 0.61218 12.6967 0.333313 11.2396 0.333313C9.7825 0.333313 8.40908 0.61218 7.11932 1.16991C5.83653 1.72765 4.70364 2.49802 3.72063 3.48103C2.74459 4.46403 1.97771 5.60042 1.41998 6.89018C0.862241 8.17296 0.583374 9.5429 0.583374 11C0.583374 12.4571 0.862241 13.8305 1.41998 15.1202C1.97771 16.403 2.74808 17.5359 3.73109 18.5189C4.71409 19.5019 5.84699 20.2723 7.12978 20.83C8.41954 21.3878 9.79296 21.6666 11.25 21.6666ZM11.25 19.8889C10.0161 19.8889 8.86224 19.6588 7.7886 19.1987C6.71496 18.7385 5.7703 18.1041 4.95462 17.2954C4.1459 16.4797 3.51148 15.5351 3.05135 14.4614C2.59819 13.3878 2.37161 12.234 2.37161 11C2.37161 9.76599 2.59819 8.61218 3.05135 7.53854C3.51148 6.4649 4.1459 5.52024 4.95462 4.70455C5.76333 3.88887 6.70451 3.25445 7.77815 2.80129C8.85178 2.34116 10.0056 2.11109 11.2396 2.11109C12.4736 2.11109 13.6274 2.34116 14.701 2.80129C15.7747 3.25445 16.7193 3.88887 17.535 4.70455C18.3507 5.52024 18.9886 6.4649 19.4487 7.53854C19.9089 8.61218 20.1389 9.76599 20.1389 11C20.1389 12.234 19.9089 13.3878 19.4487 14.4614C18.9956 15.5351 18.3612 16.4797 17.5455 17.2954C16.7368 18.1041 15.7921 18.7385 14.7115 19.1987C13.6378 19.6588 12.484 19.8889 11.25 19.8889ZM6.86834 16.2706L12.871 13.332C13.1847 13.1786 13.4252 12.9381 13.5925 12.6104L16.5102 6.61828C16.6845 6.26272 16.667 5.98037 16.4579 5.77122C16.2557 5.56207 15.9699 5.54464 15.6004 5.71893L9.61867 8.63658C9.31191 8.78299 9.07139 9.02699 8.8971 9.36861L5.969 15.3712C5.85745 15.6013 5.83305 15.807 5.89579 15.9882C5.95854 16.1625 6.07706 16.281 6.25135 16.3438C6.42564 16.4065 6.6313 16.3821 6.86834 16.2706ZM11.25 12.2863C10.8945 12.2863 10.5912 12.1608 10.3402 11.9098C10.0893 11.6588 9.96377 11.3555 9.96377 11C9.96377 10.6444 10.0893 10.3446 10.3402 10.1006C10.5912 9.84965 10.8945 9.72416 11.25 9.72416C11.5986 9.72416 11.8984 9.84965 12.1494 10.1006C12.4004 10.3446 12.5259 10.6444 12.5259 11C12.5259 11.3555 12.4004 11.6588 12.1494 11.9098C11.8984 12.1608 11.5986 12.2863 11.25 12.2863Z" fill="currentColor"/>
</svg>
`

let Apps = ({ size, ...rest }) => {
  return (
    <SvgXml xml={xml}  width={size} height={size} {...rest} />
  );
};

Apps.defaultProps = {
  size: 18,
};

Apps = React.memo ? React.memo(Apps) : Apps;

export default Apps;