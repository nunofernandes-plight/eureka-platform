import React from 'react';
import styled from 'styled-components';
import Toolbar from './Toolbar.js';
import {__GRAY_200, __GRAY_900} from '../../../helpers/colors.js';
import Icon from '../../views/icons/Icon.js';

const LeftTopContainer = styled.div`
  padding: 15px;
  border: 0.0625rem solid rgba(0, 0, 0, 0.05);
  border-radius: 0.25rem;
  box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07) !important;
  background-color: #ffffff;
  margin-right: 20px;
  height: 100%;
  margin-top: 21px;
`;
const PreviewIcon = styled.div``;
const DocumentLeftPart = ({document, ...otherProps}) => {
  return (
    <LeftTopContainer>
      <Toolbar document={document}/>

    </LeftTopContainer>
  );
};

export default DocumentLeftPart;
