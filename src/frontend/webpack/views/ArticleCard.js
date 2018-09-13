import React from 'react';
import styled from 'styled-components';
import {__THIRD} from '../../helpers/colors.js';
import {fromS3toCdn} from '../../../helpers/S3UrlConverter.js';

const Container = styled.div`
  display: flex;
  border: 1px solid ${__THIRD};
  margin: 15px 10px;
`;

const FigureSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const Figure = styled.img``;

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
const ArticleCard = ({article}) => {
  if (article.figure.length > 0) {
    const url = article.figure[0].url;
    /*    console.log(getFigureLink(url, 760, 420));*/
  }
  return (
    <Container>
      <FigureSection>
        {article.figure.length === 0 ? (
          <Figure src="/img/noPicture.png" width={'auto'} height={140} />
        ) : (
          <Figure src={getFigureLink(article.figure[0].url, 400, 250)} />
        )}
      </FigureSection>

      <TitleSection />
      <FieldsSection />
    </Container>
  );
};

export default ArticleCard;
