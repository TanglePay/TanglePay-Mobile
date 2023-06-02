import React from 'react';
import { Container, View, Text, Label, Form, Item, Button, Content, Input } from 'native-base';
import { Base, I18n } from '@tangle-pay/common';
import { S, SS, Nav, Toast } from '@/common';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { context, checkPin, resetPin } from '@tangle-pay/domain'
import { useEditWallet } from '@tangle-pay/store/common'


const schema = Yup.object().shape({
  oldPin: Yup.string().required(),
  newPin: Yup.string().required(),
  retypedPin: Yup.string().required(),
});

export const AccountResetPin = () => {
  const editWallet = useEditWallet();
  return (
    <Container>
      <Nav title={I18n.t('account.resetPinTitle')} />
      <Content>
        <Formik
          initialValues={{}}
          validateOnBlur={false}
          validateOnChange={false}
          validateOnMount={false}
          validationSchema={schema}
          onSubmit={async (values) => {
            const { oldPin, newPin, retypedPin } = values;
            if (!(await checkPin(oldPin))) {
              return Toast.error(I18n.t('account.invalidOldPin'));
            }

            if (newPin !== retypedPin) {
              return Toast.error(I18n.t('account.pinMismatch'));
            }
            if (!Base.checkPin(newPin)) {
              return Toast.error(I18n.t('account.intoPinTips'));
            }
            await resetPin(oldPin,newPin, editWallet);
            Toast.success(I18n.t('account.pinResetSuccess'));
            Base.push('main');
          }}
        >
          {({ handleChange, handleSubmit, values, errors }) => (
            <View style={[SS.p16, SS.pt8]}>
              <Form>
                <Label style={[SS.fz14, SS.mb10]}>{I18n.t('account.oldPin')}</Label>
                <Item style={[SS.mt8, SS.ml0]} error={!!errors.oldPin}>
                  <Input
                    keyboardType='ascii-capable'
                    secureTextEntry
                    textContentType={Base.isIos14 ? 'oneTimeCode' : 'none'}
                    maxLength={20}
                    style={[SS.fz14, SS.pl0, S.h(44)]}
                    placeholder={I18n.t('account.enterOldPin')}
                    onChangeText={handleChange('oldPin')}
                    value={values.oldPin}
                  />
                </Item>
                <Label style={[SS.fz14, SS.mt5,SS.mb10]}>{I18n.t('account.newPin')}</Label>
                <Item style={[SS.mt8, SS.ml0]} error={!!errors.newPin}>
                <Input
                    keyboardType='ascii-capable'
                    secureTextEntry
                    textContentType={Base.isIos14 ? 'oneTimeCode' : 'none'}
                    maxLength={20}
                    style={[SS.fz14, SS.pl0, S.h(44)]}
                    placeholder={I18n.t('account.enterNewPin')}
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
                    placeholder={I18n.t('account.retypeNewPin')}
                    onChangeText={handleChange('retypedPin')}
                    value={values.retypedPin}
                  />
                </Item>
                <View style={[S.marginT(100)]}>
                  <Button block onPress={handleSubmit}>
                    <Text>{I18n.t('account.resetPinButton')}</Text>
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
