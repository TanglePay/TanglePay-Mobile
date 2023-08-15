import React from 'react';
import { Input, Item, Label, View, Text, Button } from 'native-base';
import { Image } from 'react-native';
import { S, SS, Nav, Toast } from '@/common';
import { I18n,Base } from '@tangle-pay/common';
import { default as logo_nobg } from '@tangle-pay/assets/images/logo_nobg.png'
function PinViewComponent({ errorMessage, onSubmit }) {
  const [pin, setPin] = React.useState('');

    const handlePinChange = async (newPin) => {
        const inputValue = newPin.startsWith('*') ?  pin + newPin.slice(1) : pin.slice(0, pin.length-1)
        setPin(inputValue)
        if (inputValue.length === 20) {
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
            <Label style={[SS.fz14, SS.mt18]}>{I18n.t('account.typeYourPin')}</Label>
            <Item style={[SS.mt10,SS.mb10,SS.mr10,S.h(25.7)]} error={!!errorMessage}>
            {new Array(pin.length).fill(1).map((_,i) =>  <Text key={i} style={[S.wh(0, 0), S.border(4, '#000', 5), SS.mr3, S.radius(5)]}></Text>)}
            <Input
                maxLength={20}
                style={[SS.pl0, {color: '#fff', marginLeft: -5}]}
                onChangeText={handlePinChange}
                value={'*'}
                />
            </Item>
            <View style={[SS.h18,SS.w100]}>
                <Text style={[SS.fz14, { color: 'red' }]}>{errorMessage??''}</Text>
            </View>
            <View style={[S.marginT(8.4),SS.w100]}>
                <Button block onPress={()=>triggerSubmit()}>
                    <Text>{I18n.t('assets.confirm')}</Text>
                </Button>
            </View>
        </View>
        
        
    </View>
  );
}

export default PinViewComponent;
