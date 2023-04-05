/* eslint-disable */

import React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.5113 12.8865L10.1656 11.5194C10.0374 11.3912 9.88443 11.3271 9.7067 11.3271C9.5284 11.3271 9.37517 11.3912 9.247 11.5194C9.11882 11.6475 9.05474 11.8005 9.05474 11.9782C9.05474 12.1565 9.11882 12.3097 9.247 12.4379L10.9773 14.1682C11.134 14.3249 11.312 14.4032 11.5113 14.4032C11.7107 14.4032 11.8887 14.3249 12.0454 14.1682L15.5915 10.6222C15.7196 10.494 15.7837 10.3445 15.7837 10.1736C15.7837 10.0027 15.7196 9.84602 15.5915 9.70361C15.4633 9.57543 15.3103 9.51135 15.1326 9.51135C14.9543 9.51135 14.8011 9.57543 14.6729 9.70361L11.5113 12.8865ZM12.4085 20H12.2052C12.1414 20 12.0881 19.9858 12.0454 19.9573C10.2937 19.3876 8.84824 18.2839 7.70895 16.6462C6.56965 15.0085 6 13.1927 6 11.1989V7.35381C6 7.02626 6.09257 6.73431 6.2777 6.47797C6.46284 6.22163 6.70494 6.02937 7.00401 5.9012L11.8745 4.08545C12.0596 4.02848 12.2376 4 12.4085 4C12.5794 4 12.7575 4.02848 12.9426 4.08545L17.8131 5.9012C18.1121 6.02937 18.3542 6.22163 18.5394 6.47797C18.7245 6.73431 18.8171 7.02626 18.8171 7.35381V11.1989C18.8171 13.1927 18.2474 15.0085 17.1081 16.6462C15.9688 18.2839 14.5234 19.3876 12.7717 19.9573C12.7147 19.9858 12.5937 20 12.4085 20ZM12.4085 18.7183C13.8896 18.2483 15.1144 17.3084 16.0828 15.8985C17.0512 14.4887 17.5354 12.9221 17.5354 11.1989V7.28972C17.5354 7.247 17.5246 7.20769 17.5029 7.1718C17.4818 7.13648 17.4499 7.11882 17.4072 7.11882L12.5367 5.30307C12.494 5.28883 12.4513 5.28171 12.4085 5.28171C12.3658 5.28171 12.3231 5.28883 12.2804 5.30307L7.40988 7.11882C7.36716 7.11882 7.33497 7.13648 7.31332 7.1718C7.29225 7.20769 7.28171 7.247 7.28171 7.28972V11.1989C7.28171 12.9221 7.76591 14.4887 8.73431 15.8985C9.70271 17.3084 10.9275 18.2483 12.4085 18.7183Z" fill="currentColor"/>
</svg>
`

let Privacy = ({ size, color, ...rest }) => {
  return (
    <SvgXml xml={xml}  width={size} height={size} {...rest} />
  );
};

Privacy.defaultProps = {
  size: 18,
};

Privacy = React.memo ? React.memo(Privacy) : Privacy;

export default Privacy;
