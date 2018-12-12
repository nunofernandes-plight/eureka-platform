import React from 'react';
import styled from 'styled-components';
import {DRAFT, SUBMITTED} from '../../../models/ArticleStates.mjs';
import {__GRAY_700, __SCALE_SIX} from '../../helpers/colors.js';

const getStringFromStatus = status => {
  switch (status) {
    // case NOT_EXISTING:
    //   return 'This article does not exists.';

    case DRAFT:
      return 'The manuscript is a draft and has not been submitted yet.';

    // case FINISHED_DRAFT:
    //   return 'The manuscript is a draft and has not been submitted yet.';

    case SUBMITTED:
      return 'The manuscript has been submitted and must be peer-reviewed.';
    //
    // case OPEN_FOR_ALL_REVIEWERS:
    //   return 'The manuscript is a draft and has not been submitted yet.';
    //
    // case NOT_ENOUGH_REVIEWERS:
    //   return 'The manuscript has been submitted and must be peer-reviewed.';
    //
    // case DECLINED_SANITY_NOTOK:
    //   return 'The manuscript has been submitted and must be peer-reviewed.';
    //
    // case DECLINED:
    //   return 'The manuscript has been submitted and must be peer-reviewed.';
    //
    // case ACCEPTED:
    //   return 'The manuscript has been submitted and must be peer-reviewed.';

    default:
      return '';
  }
};

const Status = styled.div`
  font-size: 14px;
  color: ${__SCALE_SIX};
  font-style: italic;
`;

const PreviewStatus = ({status, className}) => {
  return <Status className={className}>{getStringFromStatus(status)}</Status>;
};

export default PreviewStatus;
