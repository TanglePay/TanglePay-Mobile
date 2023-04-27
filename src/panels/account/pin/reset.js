import React from 'react';
import { Container, View, Text, Label, Form, Item, Button, Content } from 'native-base';
import { Base, I18n } from '@tangle-pay/common';
import { S, SS, Nav, Toast, MaskedInput } from '@/common';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { context, checkPin, setPin } from '@tangle-pay/domain';


const schema = Yup.object().shape({
  oldPin: Yup.string().required(),
  newPin: Yup.string().required(),
  retypedPin: Yup.string().required(),
});

export const AccountResetPin = () => {
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
            await setPin(newPin);
            Toast.success(I18n.t('account.pinResetSuccess'));
            Base.push('main');
          }}
        >
          {({ handleChange, handleSubmit, values, errors }) => (
            <View style={[SS.p16, SS.pt8]}>
              <Form>
                <Label style={[SS.fz14, SS.mb10]}>{I18n.t('account.oldPin')}</Label>
                <Item style={[SS.mt8, SS.ml0]} error={!!errors.oldPin}>
                  <MaskedInput
                    style={[SS.fz14, SS.pl0, S.h(44)]}
                    placeholder={I18n.t('account.enterOldPin')}
                    onChangeText={handleChange('oldPin')}
                    value={values.oldPin}
                  />
                </Item>
                <Label style={[SS.fz14, SS.mt5,SS.mb10]}>{I18n.t('account.newPin')}</Label>
                <Item style={[SS.mt8, SS.ml0]} error={!!errors.newPin}>
                  <MaskedInput
                    style={[SS.fz14, SS.pl0, S.h(44)]}
                    placeholder={I18n.t('account.enterNewPin')}
                    onChangeText={handleChange('newPin')}
                    value={values.newPin}
                  />
                </Item>
                <Item style={[SS.ml0]} error={!!errors.retypedPin}>
                  <MaskedInput
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
