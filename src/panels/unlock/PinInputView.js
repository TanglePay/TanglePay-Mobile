import React from 'react';
import { Input, Item, Label, View, Text, Button } from 'native-base';
import { Image } from 'react-native';
import { S, SS, Nav, Toast } from '@/common';
import { I18n } from '@tangle-pay/common';
import { default as logo_nobg } from '@tangle-pay/assets/images/logo_nobg.png'
function PinViewComponent({ errorMessage, onSubmit }) {
  const [pin, setPin] = React.useState('');

    const handlePinChange = async (newPin) => {
        setPin(newPin);
        if (newPin.length === 6) {
            await triggerSubmit(newPin)
        }
    };
    const triggerSubmit = async (pin_) => {
        if (!pin_) pin_ = pin;
        const isMatch = await onSubmit(pin_);
        if (!isMatch) {
            setPin('');
        }
    }

  return (
    <View style={[SS.flex1,SS.jc,SS.ac]}>
        <Image style={[S.wh(130, 136)]} source={logo_nobg} /> 
       <View style={[SS.p16,SS.jc,SS.as,{width:328,marginTop:114}]}>
            <Text style={[SS.fz32]}>{I18n.t('account.welcomeBack')}</Text>
            <Label style={[SS.fz14, SS.mt19]}>{I18n.t('account.typeYourPin')}</Label>
            <Item style={[SS.ml0,S.h(27.7)]} error={!!errorMessage}>
                <Input
                secureTextEntry
                keyboardType="number-pad"
                style={[SS.fz14,{letterSpacing: 5}]}
                placeholder={I18n.t('account.typeYourPin')}
                onChangeText={handlePinChange}
                value={pin}
                maxLength={6}
                />
            </Item>
        </View>
        {errorMessage ? (
            <Text style={[SS.fz14, { color: 'red' }]}>{errorMessage}</Text>
        ) : null}
        <View style={[S.marginT(43.4)]}>
            <Button block onPress={triggerSubmit}>
                <Text>{I18n.t('assets.confirm')}</Text>
            </Button>
        </View>
    </View>
  );
}

export default PinViewComponent;
