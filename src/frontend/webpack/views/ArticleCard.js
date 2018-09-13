import React from 'react';
import styled from 'styled-components';
import {
  __GRAY_100,
  __GRAY_200,
  __GRAY_400,
  __THIRD
} from '../../helpers/colors.js';
import {fromS3toCdn} from '../../../helpers/S3UrlConverter.js';
import {LARGE_DEVICES} from '../../helpers/mobile.js';
import AuthorLookup from '../components/AuthorLookup.js';
import {renderField} from '../components/TextEditor/DocumentRenderer.js';

const Container = styled.div`
  display: flex;
  border: 1px solid ${__GRAY_200};
  margin: 25px 0;
  width: 100%;
  min-height: 350px;
  &:hover {
    box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  }
  transition: 0.25s all;
  background: ${__GRAY_100};
`;

const FigureSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Figure = styled.img`
  margin-bottom: auto;
  ${LARGE_DEVICES`
  width:100%; 
  `};
`;

const Title = styled.h2`
  margin: 0;
  letter-spacing: 1px;
  line-height: 1.3;
`;

const FieldsSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 35%;
  padding: 0 10px;
`;
const getFigureLink = (url, width, height) => {
  return fromS3toCdn(url, `fit=crop&w=${width}&h=${height}&auto=compress`);
};

const Authors = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: auto;
`;

const MyLabel = styled.label`
  font-size: 12px;
  font-weight: 100;
`;
const ArticleCard = ({article}) => {
  console.log(article);
  return (
    <Container>
      <FigureSection>
        {article.figure.length === 0 ? (
          <Figure src="/img/noPicture.png" width={'auto'} height={140} />
        ) : (
          <Figure src={getFigureLink(article.figure[0].url, 375, 250)} />
        )}

        <Authors>
          <AuthorLookup
            addresses={article.authors}
            right={10}
            width={35}
            height={35}
            padding={'5px'}
          />
        </Authors>
      </FigureSection>

      <TitleSection>
        <MyLabel>Title</MyLabel>
        <Title>{renderField(article, 'title')}</Title>
      </TitleSection>
      <FieldsSection />
    </Container>
  );
};

export default ArticleCard;
