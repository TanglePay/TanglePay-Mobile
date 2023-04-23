import React from 'react';
import { Container, View, Text, Input, Form, Item, Button, Content } from 'native-base';
import { Base, I18n } from '@tangle-pay/common';
import { S, SS, Nav } from '@/common';
import { Formik } from 'formik';
import * as Yup from 'yup';

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
          onSubmit={(values) => {
            const { newPin, retypedPin } = values;
            // Add your logic for setting the new PIN here
            console.log(newPin, retypedPin);
          }}
        >
          {({ handleChange, handleSubmit, values, errors }) => (
            <View style={[SS.p16, SS.pt8]}>
              <Form>
                <Item style={[SS.mt5, SS.ml0]} error={!!errors.newPin}>
                  <Text style={[SS.fz18, SS.mb10]}>{I18n.t('account.newPin')}</Text>
                  <Input
                    style={[SS.fz14, SS.pl0, S.h(44)]}
                    placeholder={I18n.t('account.enterNewPin')}
                    onChangeText={handleChange('newPin')}
                    value={values.newPin}
                  />
                </Item>
                <Item style={[SS.ml0]} error={!!errors.retypedPin}>
                  <Text style={[SS.fz18, SS.mb10]}>{I18n.t('account.retypePin')}</Text>
                  <Input
                    style={[SS.fz14, SS.pl0, S.h(44)]}
                    placeholder={I18n.t('account.retypeNewPin')}
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
