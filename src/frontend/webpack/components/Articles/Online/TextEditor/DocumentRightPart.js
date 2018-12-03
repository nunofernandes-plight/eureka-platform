import React from 'react';
import styled from 'styled-components';
import {__GRAY_600} from '../../../../../helpers/colors.js';
import Icon from '../../../../views/icons/Icon.js';

const RightTopContainer = styled.div`
  padding: 15px 10px;
  border: 0.0625rem solid rgba(0, 0, 0, 0.05);
  border-radius: 0.25rem;
  box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07) !important;
  background-color: #ffffff;
  margin-bottom: 20px;
  align-self: flex-end;
  width: 200px;

  position: absolute;
  top: -60px;
`;

const SaveChanges = styled.div`
  color: ${__GRAY_600};
  display: flex;
  justify-content: center;
`;

const renderSaveButtons = props => {
  if (props.saving) {
    return (
      <div>
        {' '}
        <Icon
          icon={'material'}
          material={'cloud_upload'}
          width={20}
          height={20}
          right={5}
          color={__GRAY_600}
        />{' '}
        Saving...
      </div>
    );
  }
  return (
    <div>
      <Icon
        icon={'material'}
        material={'cloud_done'}
        width={20}
        height={20}
        right={5}
        bottom={2}
      />{' '}
      All changes saved{' '}
    </div>
  );
};
const DocumentRightPart = props => {
  return (
    <RightTopContainer>
      <SaveChanges>{renderSaveButtons(props)}</SaveChanges>
    </RightTopContainer>
  );
};

export default DocumentRightPart;
