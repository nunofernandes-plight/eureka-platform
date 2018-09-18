import React from 'react';
import styled, {keyframes} from 'styled-components';
import {
  __ALERT_DANGER,
  __FIFTH,
  __GRAY_100,
  __GRAY_900,
  __THIRD,
  getScale
} from '../../helpers/colors.js';
import chroma from 'chroma-js';
import {fromS3toCdn} from '../../../helpers/S3UrlConverter.js';
import {LARGE_DEVICES} from '../../helpers/mobile.js';
import AuthorLookup from '../components/AuthorLookup.js';
import {renderField} from '../components/TextEditor/DocumentRenderer.js';
import TextTruncate from 'react-text-truncate';
import {withRouter} from 'react-router-dom';

const Parent = styled.div`
  position: relative;
  &:hover {
    box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
    transform: scale(1.02);
  }
  transition: all 0.2s ease-in-out;
`;
const Container = styled.div`
  display: flex;
  margin: 25px 0;
  position: relative;
  width: 100%;
  min-height: 350px;
  background: ${__GRAY_100};
  z-index: ${props => (props.onHover ? -1 : 1)};
  opacity: ${props => (props.onHover ? 0.25 : 1)};
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

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1em;
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

const Abstract = styled.div`
  margin-top: 0;
  font-style: italic;
  font-weight: 300;
  font-size: 15px;
  line-height: 1.6;
  word-break: break-word;
`;

const MyLabel = styled.label`
  font-size: 12px;
  font-weight: bold;
  margin-top: ${props => (props.top ? props.top + 'px' : null)};
`;
const ReadMore = styled.a`
  color: ${__ALERT_DANGER};
  font-style: italic;
  font-weight: bold;
`;

const Keywords = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Keyword = styled.div`
  &:first-child {
    margin: 0;
  }
  margin: 0 5px;
  color: ${props => props.color};
  background: ${props =>
    chroma(props.color)
      .alpha(0.2)
      .css()};
  text-transform: uppercase;
  padding: 4px 6px;
  border-radius: 5px;
`;

const ButtonContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 93%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${props => (props.onHover ? 1 : -1)};
  opacity: ${props => (props.onHover ? 1 : 0)};
  visibility: ${props => (props.onHover ? 'visible' : 'hidden')};
  transition: 0.3s ease-in-out;
  flex-direction: column;
`;

const ReadButton = styled.button`
  color: white;
  background: ${__FIFTH};
  cursor: pointer;
  padding: 12px 15px;
`;

const Button = styled.button`
  margin: 0;
`;
const ArticleCard = ({article, ...otherProps}) => {
  return (
    <Parent
      onMouseEnter={() => {
        otherProps.onMouseEnter(article._id);
      }}
      onMouseLeave={() => {
        otherProps.onMouseLeave(article._id);
      }}
    >
      <ButtonContainer onHover={otherProps.onHover}>
        <Button
          onClick={() => {
            otherProps.action(article.scSubmissionID, article);
          }}
        >
          {otherProps.buttonText}
        </Button>
        <ReadButton
          onClick={() => {
            otherProps.history.push(`/app/articles/preview/${article._id}`);
          }}
        >
          More
        </ReadButton>
      </ButtonContainer>
      <Container onHover={otherProps.onHover}>
        <FigureSection>
          {article.figure.length === 0 ? (
            <Figure
              src="/img/noPicture.png"
              width={170}
              height={'auto'}
              style={{alignSelf: 'center', marginTop: 15}}
            />
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

          <MyLabel top={25}>Abstract</MyLabel>
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

          <MyLabel top={9}>Keywords</MyLabel>
          <Keywords>
            {article.keywords.length === 0 ? (
              <i>No keywords found.</i>
            ) : (
              article.keywords.map((keyword, i) => {
                return (
                  <Keyword color={getScale()[i % 10]} key={i}>
                    {keyword.value}
                  </Keyword>
                );
              })
            )}
          </Keywords>
        </TitleSection>
      </Container>
    </Parent>
  );
};

export default withRouter(ArticleCard);
