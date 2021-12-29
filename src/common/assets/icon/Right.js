/* eslint-disable */

import React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
<svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.5 7C8.5 7.08414 8.48582 7.16266 8.45745 7.23558C8.4234 7.30289 8.37518 7.36739 8.31277 7.42909L1.50426 13.8233C1.39078 13.9411 1.25177 14 1.08723 14C0.979433 14 0.882979 13.9748 0.797873 13.9243C0.707092 13.8738 0.63617 13.8037 0.585107 13.7139C0.528369 13.6298 0.5 13.5317 0.5 13.4195C0.5 13.268 0.556738 13.1334 0.670213 13.0156L7.07021 7L0.670213 0.984375C0.556738 0.866587 0.5 0.731971 0.5 0.580529C0.5 0.468349 0.528369 0.370192 0.585107 0.286058C0.63617 0.196314 0.707092 0.126202 0.797873 0.0757212C0.882979 0.0252404 0.979433 0 1.08723 0C1.25177 0 1.39078 0.0560897 1.50426 0.168269L8.31277 6.57091C8.37518 6.63261 8.4234 6.69992 8.45745 6.77284C8.48582 6.84014 8.5 6.91587 8.5 7Z" fill="currentColor"/>
</svg>
`

let Right = ({ size, ...rest }) => {
  return (
    <SvgXml xml={xml}  width={size} height={size} {...rest} />
  );
};

Right.defaultProps = {
  size: 18,
};

Right = React.memo ? React.memo(Right) : Right;

export default Right;
