import React from 'react';
import { Input } from 'native-base';

export const MaskedInput = ({ maxLength, value, onChangeText, ...props }) => {
  const maskedValue = value ? value.replace(/./g, '*') : value;

  const handleInputChange = (masked) => {
    let neoValue = value ?? '';
    if (masked.length > neoValue.length) {
      const lastChar = masked[masked.length - 1];
      neoValue = neoValue + lastChar;
    } else {
      neoValue = neoValue.slice(0, masked.length);
    }
    const inputValue = neoValue.slice(0, maxLength??8);
    console.log('unmasked value', inputValue);
    onChangeText(inputValue);
  };

  return (
    <Input
      {...props}
      keyboardType="numeric"
      maxLength={maxLength??8}
      value={maskedValue}
      onChangeText={handleInputChange}
    />
  );
};
