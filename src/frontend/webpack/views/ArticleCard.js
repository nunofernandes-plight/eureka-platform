import React from 'react';
import styled from 'styled-components';
import {__THIRD} from '../../helpers/colors.js';
import {fromS3toCdn} from '../../../helpers/S3UrlConverter.js';
import Author from './Author.js';
import {LARGE_DEVICES} from '../../helpers/mobile.js';
import AuthorLookup from '../components/AuthorLookup.js';

const Container = styled.div`
  display: flex;
  border: 1px solid ${__THIRD};
  margin: 25px 0;
  width: 100%;
  padding: 10px 0;
  min-height: 350px;
`;

const FigureSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 45%;
`;

const Figure = styled.img`
  ${LARGE_DEVICES`
  width:100%; 
  `};
`;

const Figures = styled.div`
  display: flex;
`;

const FieldsSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
`;
const getFigureLink = (url, width, height) => {
  return fromS3toCdn(url, `fit=crop&w=${width}&h=${height}&auto=compress`);
};

const Authors = styled.div`
  display: flex;
  flex-direction: column;
`;
const ArticleCard = ({article}) => {
  return (
    <Container>
      <FigureSection>
        {article.figure.length === 0 ? (
          <Figure src="/img/noPicture.png" width={'auto'} height={140} />
        ) : (
          <Figure src={getFigureLink(article.figure[0].url, 350, 250)} />
        )}

        <Authors>
          <AuthorLookup
            addresses={article.authors}
            right={10}
            width={40}
            height={40}
          />
        </Authors>
      </FigureSection>

      <TitleSection />
      <FieldsSection />
    </Container>
  );
};

export default ArticleCard;
