import React from 'react';
import { Base } from '@tangle-pay/common'
import { context } from '@tangle-pay/domain'
import UnlockViewModel from '@/common/viewmodel/UnlockViewModel';
import PinInputView from './PinInputView';
import { Container, Content, View, Text, Input, Item } from 'native-base';
import { StatusBar } from 'react-native';
import { SS, ThemeVar } from '@/common';

export const UnlockScreen = () => {
    const successCallback = () => {
        Base.push(context.state.walletCount > 0 ? 'main' : 'account/changeNode')
    }

  return (
    <Container>
        <Content contentContainerStyle={[
					SS.ph16,
          SS.flex1,
					{ paddingTop: ThemeVar.platform === 'android' ? StatusBar.currentHeight + 24 : 24 }
				]}>
            <UnlockViewModel PinView={PinInputView} successCallback={successCallback} />
        </Content>
     </Container>
  );
  
}