/* eslint-disable */

import { FunctionComponent } from 'react';
// Don't forget to install package: @types/react-native
import { ViewProps } from 'react-native';
import { GProps } from 'react-native-svg';

export { default as About } from './About';
export { default as Apps } from './Apps';
export { default as Assets } from './Assets';
export { default as Cache } from './Cache';
export { default as Checkbox0 } from './Checkbox0';
export { default as Checkbox1 } from './Checkbox1';
export { default as Copy } from './Copy';
export { default as Down } from './Down';
export { default as Edit } from './Edit';
export { default as Encrypt } from './Encrypt';
export { default as Eye0 } from './Eye0';
export { default as Eye1 } from './Eye1';
export { default as File } from './File';
export { default as History } from './History';
export { default as Into } from './Into';
export { default as Lang } from './Lang';
export { default as Left } from './Left';
export { default as Me } from './Me';
export { default as More } from './More';
export { default as Network } from './Network';
export { default as NoScreenshot } from './NoScreenshot';
export { default as NoData } from './NoData';
export { default as Outto } from './Outto';
export { default as Privacy } from './Privacy';
export { default as Right } from './Right';
export { default as Scan } from './Scan';
export { default as Set } from './Set';
export { default as Share } from './Share';
export { default as Staking } from './Staking';
export { default as Tick } from './Tick';
export { default as Time } from './Time';
export { default as Up } from './Up';
export { default as View } from './View';
export { default as Wallet } from './Wallet';

interface Props extends GProps, ViewProps {
  name: 'about' | 'apps' | 'assets' | 'cache' | 'checkbox_0' | 'checkbox_1' | 'copy' | 'down' | 'edit' | 'encrypt' | 'eye_0' | 'eye_1' | 'file' | 'history' | 'into' | 'lang' | 'left' | 'me' | 'more' | 'network' | 'no_screenshot' | 'noData' | 'outto' | 'privacy' | 'right' | 'scan' | 'set' | 'share' | 'staking' | 'tick' | 'time' | 'up' | 'view' | 'wallet';
  size?: number;
  color?: string | string[];
}

declare const IconFont: FunctionComponent<Props>;

export default IconFont;
