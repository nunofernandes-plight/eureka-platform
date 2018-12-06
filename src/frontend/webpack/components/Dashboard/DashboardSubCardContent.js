import React from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import {
  __ALERT_ERROR,
  __GRAY_100,
  __GRAY_600
} from '../../../helpers/colors.js';
import {renderField} from '../Articles/Online/TextEditor/DocumentRenderer.mjs';
import moment from 'moment';
import {renderTimestamp} from '../../../helpers/timestampRenderer.js';

const Container = styled.div`
  flex: 1;
`;

const MyLink = styled(Link)`
  transition: 0.3s all ease-in-out;
  cursor: pointer;
  color: ${__ALERT_ERROR};
  font-size: 13px;
  text-decoration: none;
`;

const Title = styled.div`
  font-weight: bold;
  color: ${__ALERT_ERROR};
  font-style: italic;
  font-size: 12px;
  margin-top: 0;
  margin-bottom: 2px;
  display: flex;
  flex: 1;
`;

const renderContent = (content, title) => {
  if (title === 'Articles') {
    return (
      <Content>
        <MyLink to={'skü'}>{renderField(content.document, 'title')} </MyLink>{' '}
      </Content>
    );
  }
  return 'ciao';

  /* if (title === 'Articles') {
    return <MyLink to={'tdb'}>{renderedTitle}</MyLink>;
  }
  return <MyLink to={'asf'}>ciao</MyLink>;*/
};

const renderTime = (title, content) => {
  if (title === 'Articles') {
    return <Time>({moment(content.updatedAt).calendar()})</Time>;
  }
};

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const Time = styled.div`
  color: ${__GRAY_600};
  font-size: 9px;
  font-weight: lighter;
  margin-left: auto;
`;

const DashboardSubCardContent = ({content, start, title}) => {
  return (
    <Container>
      {content === undefined ? (
        <MyLink to={'tdb'}>{start}</MyLink>
      ) : (
        <div style={{flex: 1}}>
          <Title>Last Modified {renderTime(title, content)}</Title>
          {renderContent(content, title)}
        </div>
      )}
    </Container>
  );
};

export default DashboardSubCardContent;
