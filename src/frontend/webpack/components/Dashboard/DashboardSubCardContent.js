import React from 'react';
import styled from 'styled-components';
import {__GRAY_600, __GRAY_700} from '../../../helpers/colors.js';
import {renderField} from '../Articles/Online/TextEditor/DocumentRenderer.mjs';
import moment from 'moment';
import Slick from '../../design-components/Slick/Slick.js';
import MaterialButton from '../../design-components/MaterialButton.js';
import AuthorLookup from '../AuthorLookup.js';

const Container = styled.div`
  flex: 1;
  word-break: break-word;
`;

const MyLink = styled.div`
  transition: 0.3s all ease-in-out;
  cursor: pointer;
  font-size: 13px;
  text-decoration: none;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 12px;
  margin-top: 0;
  margin-bottom: 2px;
  display: flex;
  flex: 1;
`;

const SlickContainer = styled.div`
  width: 100%;
`;

const getFiguresAndTitles = (document, id) => {
  console.log(document);
  return {
    legend: renderField(document, 'title'),
    link: `/app/preview/${id}`,
    image: renderField(document, 'figure')[0]
  };
};

const renderContent = (content, title, path, categoryTitle, total) => {
  if (title === 'Articles') {
    return (
      <Content>
        <MyLink to={path}>{renderField(content.document, 'title')} </MyLink>{' '}
      </Content>
    );
  }
  if (title === 'Reviews') {
    if (categoryTitle === 'ArticlesToReview') {
      const items = content.map(article => {
        return getFiguresAndTitles(article.document, article._id);
      });
      if (items && items.length !== 0) {
        return (
          <SlickContainer>
            <Slick
              showStatus={false}
              showThumbs={false}
              showIndicators={false}
              infiniteLoop={true}
              items={items}
              more={`...discover more than ${total} articles`}
              moreLink={path}
            />
          </SlickContainer>
        );
      } else {
        return (
          <MyLink to={path}>
            <StartText>
              At the moment, there are no articles that can be peer-reviewed.
            </StartText>
          </MyLink>
        );
      }
    }
  }
  return '...';
};

const renderTime = (title, content) => {
  if (title === 'Articles') {
    return <Time>(Last modified, {moment(content.updatedAt).calendar()})</Time>;
  }
};

const Content = styled.div`
  display: flex;
  flex-direction: column;
  font-style: italic;
`;

const Time = styled.div`
  color: ${__GRAY_600};
  font-size: 9px;
  font-weight: lighter;
  margin-left: auto;
`;

const StartText = styled.div`
  color: ${__GRAY_700};
  font-style: italic;
  font-weight: lighter;
`;

const DashboardSubCardContent = ({
  content,
  start,
  title,
  subTitle,
  path,
  categoryTitle,
  total
}) => {
  console.log(content);
  return (
    <Container>
      {!content || content === undefined ? (
        <MyLink to={path}>
          <StartText>{start}</StartText>
        </MyLink>
      ) : (
        <div style={{flex: 1}}>
          <Title>
            {subTitle} {renderTime(title, content)}
          </Title>
          {renderContent(content, title, path, categoryTitle, total)}
        </div>
      )}
    </Container>
  );
};

export default DashboardSubCardContent;
