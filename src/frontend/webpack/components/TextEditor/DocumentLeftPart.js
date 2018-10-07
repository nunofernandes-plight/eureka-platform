import React from 'react';
import styled from 'styled-components';
import Toolbar from './Toolbar.js';
import {__GRAY_200} from '../../../helpers/colors.js';

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

const Separator = styled.div`
  height: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${__GRAY_200};
  margin: 6.5px 0;
`;

const PreviewIcon = styled.div``;
const DocumentLeftPart = () => {
  return (
    <LeftTopContainer>
      <Toolbar />
      <Separator />
      <PreviewIcon>asfa</PreviewIcon>
    </LeftTopContainer>
  );
};

export default DocumentLeftPart;
