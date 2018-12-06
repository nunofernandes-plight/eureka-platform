import React from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import {__ALERT_ERROR} from '../../../helpers/colors.js';

const Container = styled.div``;

const MyLink = styled(Link)`
  transition: 0.3s all ease-in-out;
  cursor: pointer;
  margin-top: 4px;
  color: ${__ALERT_ERROR};
  font-size: 13px;
  text-decoration: none;
`;

const renderContent = (content) => {

}


const DashboardSubCardContent = ({content, start}) => {
  const myContent = renderContent(content);
  return (
    <Container>
      {content === undefined ? (
        <MyLink to={'tdb'}>{start}</MyLink>
      ) : (
        <MyLink to={'tdb'}>ciao ciao ciao</MyLink>
      )}
    </Container>
  );
};

export default DashboardSubCardContent;
