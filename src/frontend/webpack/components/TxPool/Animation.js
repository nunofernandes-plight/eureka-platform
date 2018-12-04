import React from 'react';
import TRANSACTION_STATUS from '../../../../helpers/TransactionStatus.mjs';
import LottieManager from '../LottieManager.js';
import * as spinner from './spinner.json';
import * as success from './success.json';
import {__ALERT_ERROR} from '../../../helpers/colors.js';

export const Animation = ({status}) => {
  if (
    status === TRANSACTION_STATUS.ERROR ||
    status === TRANSACTION_STATUS.REVERTED
  ) {
    return <i style={{color: __ALERT_ERROR}}>error</i>;
  } else if (status === TRANSACTION_STATUS.COMPLETED) {
    return (
      <LottieManager
        loop={false}
        animationData={success}
        width={35}
        height={35}
        onComplete={() => {}}
      />
    );
  } else {
    return (
      <LottieManager
        loop={true}
        animationData={spinner}
        width={37}
        height={36}
        onComplete={() => {}}
      />
    );
  }
};
