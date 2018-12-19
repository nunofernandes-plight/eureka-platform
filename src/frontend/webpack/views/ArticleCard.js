import React from 'react';
import styled from 'styled-components';
import {
  __ALERT_DANGER,
  __ALERT_ERROR,
  __ALERT_WARNING,
  __GRAY_100,
  __THIRD,
  getScale
} from '../../helpers/colors.js';
import chroma from 'chroma-js';
import {fromS3toCdn} from '../../../helpers/S3UrlConverter.js';
import AuthorLookup from '../components/AuthorLookup.js';
import {renderField} from '../components/Articles/Online/TextEditor/DocumentRenderer.mjs';
import TextTruncate from 'react-text-truncate';
import {withRouter} from 'react-router-dom';
import Ink from 'react-ink';
import Icon from './icons/Icon.js';
import {EXTRA_LARGE_DEVICES, LARGE_DEVICES} from '../../helpers/mobile.js';

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
  ${LARGE_DEVICES`
    flex-direction: column; 
  `};
`;

const FigureSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  ${LARGE_DEVICES`
    order: 1; 
  `};
`;

const Figure = styled.img`
  margin-bottom: auto;
`;

const Title = styled.h2`
  margin: 0;
  letter-spacing: 1px;
  line-height: 1.3;
  cursor: pointer;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1em;
  cursor: pointer;
  margin-left: 1em;
  flex: 1;
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
  cursor: pointer;
`;

const MyLabel = styled.label`
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
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

const FigureContainer = styled.div`
  position: relative;
`;

const FancyButtonContainer = styled.div`
  position: absolute;
  height: 100%;
`;
const FancyButton = styled.div`
  &:hover {
    font-size: 14.3px;
  }
  position: relative;
  top: ${props => props.top}%;
  background: ${props => props.background};
  font-weight: bold;
  cursor: pointer;
  color: white;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-left: -2rem;
  visibility: ${props => (props.show ? 'visible' : 'hidden')};
  transform: ${props =>
    props.show ? 'translateX(2rem)' : 'translateX(0rem)'};
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  border-bottom-right-radius: 5px;
  border-top-right-radius: 5px;
  padding: 0.625rem 1rem;
`;
const NoImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ArticleCard = ({article, ...otherProps}) => {
  return (
    <Parent
      onMouseEnter={() => {
        otherProps.onMouseEnter(article);
      }}
      onMouseLeave={() => {
        otherProps.onMouseLeave(article);
      }}
    >
      <Container>
        <FigureSection>
          <FigureContainer>
            <FancyButtonContainer>
              <FancyButton
                show={otherProps.show}
                background={__ALERT_ERROR}
                top={10}
                onClick={() => {
                  otherProps.action(article.scSubmissionID, article);
                }}
              >
                <Ink />
                {otherProps.buttonText}
              </FancyButton>
              {otherProps.button2Text ? (
                <FancyButton
                  show={otherProps.show}
                  background={__ALERT_WARNING}
                  top={17.5}
                  onClick={() => {
                    otherProps.action2(article.scSubmissionID, article);
                  }}
                >
                  <Ink />
                  {otherProps.button2Text}
                </FancyButton>
              ) : null}
            </FancyButtonContainer>
            {article.figure.length === 0 ? (
              <NoImageContainer>
                <Icon
                  noMove
                  icon={'noImage'}
                  width={150}
                  height={150}
                  color={__THIRD}
                  top={25}
                />
              </NoImageContainer>
            ) : (
              <Figure src={getFigureLink(article.figure[0].url, 375, 250)} />
            )}
          </FigureContainer>

          <Authors>
            <AuthorLookup
              addresses={article.authors}
              right={10}
              width={35}
              height={35}
              fontSize={12}
              padding={'12px'}
            />
          </Authors>
        </FigureSection>
        <TitleSection
          onClick={() => {
            otherProps.history.push(`/app/preview/${article._id}`);
          }}
        >
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
