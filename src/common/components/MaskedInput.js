import React from 'react';
import { Input } from 'native-base';

export const MaskedInput = ({ value, onChangeText, ...props }) => {
  const maskedValue = value ? value.replace(/./g, '*') : value;

  const handleInputChange = (masked) => {
    let neoValue = value ?? '';
    if (masked.length > neoValue.length) {
      const lastChar = masked[masked.length - 1];
      neoValue = neoValue + lastChar;
    } else {
      neoValue = neoValue.slice(0, masked.length);
    }
    const inputValue = neoValue.replace(/[^\d]/g, '').slice(0, 6);
    console.log('unmasked value', inputValue);
    onChangeText(inputValue);
  };

  return (
    <Input
      {...props}
      keyboardType="numeric"
      maxLength={6}
      value={maskedValue}
      onChangeText={handleInputChange}
    />
  );
};
