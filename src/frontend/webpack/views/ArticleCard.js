import React from 'react';
import styled from 'styled-components';
import {
  __ALERT_DANGER,
  __ALERT_WARNING,
  __GRAY_100,
  __GRAY_200
} from '../../helpers/colors.js';
import {fromS3toCdn} from '../../../helpers/S3UrlConverter.js';
import {LARGE_DEVICES} from '../../helpers/mobile.js';
import AuthorLookup from '../components/AuthorLookup.js';
import {renderField} from '../components/TextEditor/DocumentRenderer.js';
import TextTruncate from 'react-text-truncate';

const Container = styled.div`
  display: flex;
  margin: 25px 0;
  width: 100%;
  min-height: 350px;
  &:hover {
    box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
    transform: scale(1.02);
  }
  transition: all 0.2s ease-in-out;
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
  padding: 1em;
  font-family: 'Roboto', sans-serif;
  margin-left: 1em;
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

const Abstract = styled.p`
  margin-top: 0;
  font-style: italic;
`;

const MyLabel = styled.label`
  font-size: 12px;
  font-weight: bold;
`;
const ReadMore = styled.a`
  color: ${__ALERT_DANGER};
  font-style: italic;
  font-weight: bold;
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
            padding={'12px'}
          />
        </Authors>
      </FigureSection>

      <TitleSection>
        <MyLabel>Title</MyLabel>
        <Title>{renderField(article, 'title')}</Title>

        <MyLabel style={{marginTop: '25px'}}>Abstract</MyLabel>
        <Abstract>
          <TextTruncate
            text={
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean\n' +
              '          feugiat orci vitae leo maximus malesuada. Suspendisse suscipit nulla\n' +
              '          non augue ultricies, eu eleifend felis volutpat. Maecenas venenatis,\n' +
              '          erat nec viverra mattis, elit libero tristique massa, a imperdiet nibh\n' +
              '          ligula id urna. Morbi ullamcorper sodales semper. Fusce dignissim,\n' +
              '          erat sed ornare viverra, elit lacus faucibus tellus, nec varius odio\n' +
              '          enim eget risus. Nullam eu ipsum ex. Suspendisse sed dapibus ante.\n' +
              '          Proin placerat urna in mauris vehicula imperdiet.'
            }
            line={6}
            truncateText={'...'}
            textTruncateChild={<ReadMore href="#">Read More</ReadMore>}
          />
        </Abstract>
      </TitleSection>
      <FieldsSection />
    </Container>
  );
};

export default ArticleCard;
