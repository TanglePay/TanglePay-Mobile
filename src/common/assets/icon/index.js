/* eslint-disable */

import React from 'react';

import About from './About';
import Apps from './Apps';
import Assets from './Assets';
import Cache from './Cache';
import Checkbox0 from './Checkbox0';
import Checkbox1 from './Checkbox1';
import Copy from './Copy';
import Down from './Down';
import Edit from './Edit';
import Encrypt from './Encrypt';
import Eye0 from './Eye0';
import Eye1 from './Eye1';
import File from './File';
import History from './History';
import Into from './Into';
import Lang from './Lang';
import Left from './Left';
import Me from './Me';
import More from './More';
import Network from './Network';
import NoScreenshot from './NoScreenshot';
import NoData from './NoData';
import Outto from './Outto';
import Privacy from './Privacy';
import Right from './Right';
import Scan from './Scan';
import Set from './Set';
import Share from './Share';
import Staking from './Staking';
import Tick from './Tick';
import Time from './Time';
import Up from './Up';
import View from './View';
import Wallet from './Wallet';
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

let IconFont = ({ name, ...rest }) => {
  switch (name) {
    case 'about':
      return <About key="L1" {...rest} />;
    case 'apps':
      return <Apps key="L2" {...rest} />;
    case 'assets':
      return <Assets key="L3" {...rest} />;
    case 'cache':
      return <Cache key="L4" {...rest} />;
    case 'checkbox_0':
      return <Checkbox0 key="L5" {...rest} />;
    case 'checkbox_1':
      return <Checkbox1 key="L6" {...rest} />;
    case 'copy':
      return <Copy key="L7" {...rest} />;
    case 'down':
      return <Down key="L8" {...rest} />;
    case 'edit':
      return <Edit key="L9" {...rest} />;
    case 'encrypt':
      return <Encrypt key="L10" {...rest} />;
    case 'eye_0':
      return <Eye0 key="L11" {...rest} />;
    case 'eye_1':
      return <Eye1 key="L12" {...rest} />;
    case 'file':
      return <File key="L13" {...rest} />;
    case 'history':
      return <History key="L14" {...rest} />;
    case 'into':
      return <Into key="L15" {...rest} />;
    case 'lang':
      return <Lang key="L16" {...rest} />;
    case 'left':
      return <Left key="L17" {...rest} />;
    case 'me':
      return <Me key="L18" {...rest} />;
    case 'more':
      return <More key="L19" {...rest} />;
    case 'network':
      return <Network key="L20" {...rest} />;
    case 'no_screenshot':
      return <NoScreenshot key="L21" {...rest} />;
    case 'noData':
      return <NoData key="L22" {...rest} />;
    case 'outto':
      return <Outto key="L23" {...rest} />;
    case 'privacy':
      return <Privacy key="L24" {...rest} />;
    case 'right':
      return <Right key="L25" {...rest} />;
    case 'scan':
      return <Scan key="L26" {...rest} />;
    case 'set':
      return <Set key="L27" {...rest} />;
    case 'share':
      return <Share key="L28" {...rest} />;
    case 'staking':
      return <Staking key="L29" {...rest} />;
    case 'tick':
      return <Tick key="L30" {...rest} />;
    case 'time':
      return <Time key="L31" {...rest} />;
    case 'up':
      return <Up key="L32" {...rest} />;
    case 'view':
      return <View key="L33" {...rest} />;
    case 'wallet':
      return <Wallet key="L34" {...rest} />;
  }

  return null;
};

IconFont = React.memo ? React.memo(IconFont) : IconFont;

export default IconFont;
