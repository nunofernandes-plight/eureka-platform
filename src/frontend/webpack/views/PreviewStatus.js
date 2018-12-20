import React from 'react';
import styled from 'styled-components';
import {__SCALE_SIX} from '../../helpers/colors.js';
import ARTICLE_VERSION_STATE from '../../../backend/schema/article-version-state-enum.mjs';

const getStringFromStatus = status => {
  switch (status) {
    case ARTICLE_VERSION_STATE.NOT_EXISTING:
      return 'This article does not exists.';

    case ARTICLE_VERSION_STATE.DRAFT:
      return 'This article is a draft and has not been submitted yet.';

    case ARTICLE_VERSION_STATE.FINISHED_DRAFT:
      return 'This article is a finished draft and waits for the submission confirmation.';

    case ARTICLE_VERSION_STATE.SUBMITTED:
      return 'This article has been submitted. It is currently being sanity checked before it is released for the peer review process.';

    case ARTICLE_VERSION_STATE.OPEN_FOR_ALL_REVIEWERS:
      return 'This article is currently being reviewed.';

    case ARTICLE_VERSION_STATE.NOT_ENOUGH_REVIEWERS:
      return 'This article was declined because not enough reviewers were found.';

    case ARTICLE_VERSION_STATE.DECLINED_SANITY_NOTOK:
      return 'This article was declined because it did not pass the sanity check and was therefore not released for the peer review process.';

    case ARTICLE_VERSION_STATE.DECLINED:
      return 'This article was declined after being reviewed.';

    case ARTICLE_VERSION_STATE.ACCEPTED:
      return 'This article was reviewed, accepted and published.';

    default:
      return '';
  }
};

const Status = styled.div`
  font-size: 12px;
  color: white;
`;

const PreviewStatus = ({status, className}) => {
  return <Status className={className}>{getStringFromStatus(status)}</Status>;
};

export default PreviewStatus;
