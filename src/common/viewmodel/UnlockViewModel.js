import React, {useState} from 'react';
import { tryUnlock, canTryUnlock, context, formatMillis } from '@tangle-pay/domain';
import { I18n } from '@tangle-pay/common'
export default function UnlockViewModel({PinView, successCallback}) {
    const [errorMessage, setErrorMessage] = useState('');
    const genErrorMessage = () => {
        if ( context.state.unlockTryLefted > 0 ) {
            return I18n.t('account.pinTryLeft').replace('${left}', context.state.unlockTryLefted);
        } else {
            // ${until} is a date string in format 'YYYY-MM-DD HH:mm:ss', context.state.unlockTryLeftedZeroValidUntil is milliseconds
            return I18n.t('account.pinCanNotTryUntil').replace('${time}', formatMillis(context.state.unlockTryLeftedZeroValidUntil));
        }
    }
    const onSubmit = async (pin) => {
        console.log(pin);
        const isCanTryUnlock = await canTryUnlock();
        if (!isCanTryUnlock) {
            setErrorMessage(genErrorMessage());
            return false;
        }
        try {
            const isUnlockSuccess = await tryUnlock(pin);
            if (isUnlockSuccess) {
                successCallback();
                return true;
            } else {
                setErrorMessage(genErrorMessage());
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }
        
    return (
        <PinView
            errorMessage={errorMessage}
            onSubmit={onSubmit}
        />
    );
}

