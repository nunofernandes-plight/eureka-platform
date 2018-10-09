import React from 'react';
import styled from 'styled-components';
import {DRAFT, SUBMITTED} from '../../../models/ArticleStates.mjs';
import {__GRAY_700} from '../../helpers/colors.js';

const getStringFromStatus = status => {
  switch (status) {
    case DRAFT:
      return 'The manuscript is a draft and has not been submitted yet.';

    case SUBMITTED:
      return 'The manuscript has been submitted and must be peer-reviewed.';

    default:
      return '';
  }
};

const Status = styled.div`
  font-size: 12px;
  color: ${__GRAY_700};
  font-style: italic;
`;

const PreviewStatus = ({status}) => {
  return <Status>{getStringFromStatus(status)}</Status>;
};

export default PreviewStatus;
