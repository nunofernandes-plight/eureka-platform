import SC_TRANSACTIONS_TYPE from '../../backend/schema/sc-transaction-state-enum.mjs';
import {__SCALE_EIGHT, __SCALE_ONE, __SCALE_SEVEN, __SCALE_TEN, __SCALE_THREE, __SCALE_TWO} from './colors.js';
import React from 'react';

export const getTypeAttributes = type => {
  switch (type) {
    case SC_TRANSACTIONS_TYPE.SUBMIT_ARTICLE:
      return {color: __SCALE_ONE, text: 'ARTICLE SUBMISSION'};

    case SC_TRANSACTIONS_TYPE.EDITOR_ASSIGNED:
      return {color: __SCALE_TWO, text: 'EDITOR ASSIGNMENT'};

    case SC_TRANSACTIONS_TYPE.EDITOR_ARTICLE_ASSIGNMENT:
      return {color: __SCALE_TWO, text: 'ARTICLE ASSIGNED TO YOURSELF'};

    case SC_TRANSACTIONS_TYPE.MINTING:
      return {color: __SCALE_THREE, text: 'MINTING'};

    case SC_TRANSACTIONS_TYPE.EXPERT_REVIEWER_SIGNEDUP:
      return {color: __SCALE_SEVEN, text: 'EXPERT REVIEWER SIGNED UP'};

    case SC_TRANSACTIONS_TYPE.SANITY_OK:
      return {color: __SCALE_EIGHT, text: 'ARTICLE SANITY ACCEPTED'};

    case SC_TRANSACTIONS_TYPE.SANITY_NOT_OK:
      return {color: __SCALE_EIGHT, text: 'ARTICLE SANITY DECLINED'};

    default:
      return {color: __SCALE_TEN, text: ''};
  }
};