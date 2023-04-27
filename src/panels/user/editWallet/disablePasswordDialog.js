import React, { useState, useImperativeHandle, useEffect, useRef } from 'react';
import { View, Text, Form, Item, Input, Button } from 'native-base';
import { ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import { I18n, Base, IotaSDK } from '@tangle-pay/common';
import { useEditWallet } from '@tangle-pay/store/common';
import { Toast } from '@/common';
import { context, markWalletPasswordDisabled } from '@tangle-pay/domain';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { S, SS } from '@/common';

export const DisablePasswordDialog = ({ dialogRef, data }) => {
  const [isShow, setShow] = useState(false);
  const callBackRef = useRef();
  const editWallet = useEditWallet();
  useImperativeHandle(dialogRef, () => {
    return {
      show,
    };
  });

  const show = (callback) => {
    callBackRef.current = callback;
    setShow(true);
  };

  const hide = () => {
    if (callBackRef.current) {
      callBackRef.current().then(() => {
        setShow(false);
      });
    }
  };

  return (
    <Modal hasBackdrop backdropOpacity={0.3} onBackButtonPress={hide} onBackdropPress={hide} isVisible={isShow}>
      <View style={[SS.w100, SS.radius10, SS.bgW]}>
        <ScrollView contentContainerStyle={[SS.p16]}>
          <Formik
            initialValues={{
              currentPassword: '',
            }}
            isValidating={true}
            validationSchema={Yup.object().shape({
              currentPassword: Yup.string().required(),
            })}
            onSubmit={async (values, { resetForm }) => {
              // Disable wallet password logic here
              const isPassword = await IotaSDK.checkPassword(data.seed, values.currentPassword)
              if (!isPassword) {
                return Toast.error(I18n.t('account.invalidPassword'));
              }
              try {
                    Toast.showLoading();
                    editWallet(data.id, { ...data, password: context.state.pin, oldPassword: values.currentPassword }, true);
                    await markWalletPasswordDisabled(data.id);
                    Toast.success(I18n.t('account.passwordDisabled'));
                    resetForm();
                } finally {
                    Toast.hideLoading();
                    hide();
                }
            }}
          >
            {({ handleChange, handleSubmit, values, errors, resetForm }) => (
              <Form>
                <Text style={[SS.fz18, SS.fw600]}>{I18n.t('account.enterCurrentPassword')}</Text>
                <Item style={[SS.mt10, SS.ml0, { minHeight: 50 }]} stackedLabel error={!!errors.currentPassword}>
                  <Input
                    style={[SS.fz14]}
                    placeholder={I18n.t('account.enterCurrentPassword')}
                    onChangeText={handleChange('currentPassword')}
                    value={values.currentPassword}
                  />
                </Item>
                <View style={[S.marginT(24)]}>
                  <Button block onPress={handleSubmit}>
                    <Text>{I18n.t('assets.confirm')}</Text>
                  </Button>
                </View>
              </Form>
            )}
          </Formik>
        </ScrollView>
      </View>
    </Modal>
  );
};
