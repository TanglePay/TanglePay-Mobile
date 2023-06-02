import React from 'react';
import { Container, View, Label, Text, Form, Item, Button, Content, Input } from 'native-base';
import { Base, I18n } from '@tangle-pay/common';
import { S, SS, Nav, Toast } from '@/common';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { setPin } from '@tangle-pay/domain';

const schema = Yup.object().shape({
  newPin: Yup.string().required(),
  retypedPin: Yup.string().required(),
});

export const AccountSetPin = () => {
  return (
    <Container>
      <Nav title={I18n.t('account.setPinTitle')} />
      <Content>
        <Formik
          initialValues={{}}
          validateOnBlur={false}
          validateOnChange={false}
          validateOnMount={false}
          validationSchema={schema}
          onSubmit={async (values) => {
            const { newPin, retypedPin } = values;
            // Add your logic for setting the new PIN here
            if (newPin !== retypedPin) {
              return Toast.error(I18n.t('account.pinMismatch'));
            }
            if (!Base.checkPin(newPin)) {
              return Toast.error(I18n.t('account.intoPinTips'));
            }
            await setPin(newPin);
            Toast.success(I18n.t('account.pinResetSuccess'));
            Base.push('main');
            console.log(newPin, retypedPin);
          }}
        >
          {({ handleChange, handleSubmit, values, errors }) => (
            <View style={[SS.p16, SS.pt8]}>
              <Form>
              <Label style={[SS.fz18, SS.mb10]}>{I18n.t('account.setPinTitle')}</Label>
                <Item style={[SS.mt5, SS.ml0]} error={!!errors.newPin}>
                <Input
                    keyboardType='ascii-capable'
                    secureTextEntry
                    textContentType={Base.isIos14 ? 'oneTimeCode' : 'none'}
                    maxLength={20}
                    style={[SS.fz14, SS.pl0, S.h(44)]}
                    placeholder={I18n.t('account.intoPinTips')}
                    onChangeText={handleChange('newPin')}
                    value={values.newPin}
                  />
                </Item>
                <Item style={[SS.ml0]} error={!!errors.retypedPin}>
                <Input
                    keyboardType='ascii-capable'
                    secureTextEntry
                    textContentType={Base.isIos14 ? 'oneTimeCode' : 'none'}
                    maxLength={20}
                    style={[SS.fz14, SS.pl0, S.h(44)]}
                    placeholder={I18n.t('account.retypePin')}
                    onChangeText={handleChange('retypedPin')}
                    value={values.retypedPin}
                  />
                </Item>
                <View style={[S.marginT(100)]}>
                  <Button block onPress={handleSubmit}>
                    <Text>{I18n.t('account.setPinButton')}</Text>
                  </Button>
                </View>
              </Form>
            </View>
          )}
        </Formik>
      </Content>
    </Container>
  );
};
