import React, {Component} from 'react';
import styled from 'styled-components';
import {TopContainer} from './TopContainer.js';
import {Row} from '../../helpers/layout.js';
import Icon from '../icons/Icon.js';
import {__ALERT_INFO, __ALERT_SUCCESS, __THIRD} from '../../helpers/colors.js';

const Parent = styled.div`
  display: flex;
  flex-direction: column;
`;

const CardContainer = styled.div`
  transition: all 0.5s 
  display: flex;
  width: 100%;
  justify-content: space-evenly;
  padding: 0 20px;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  word-wrap: break-word;
  border: 0.0625rem solid rgba(0, 0, 0, 0.05);
  border-radius: 0.25rem;
  background-color: #ffffff;
  background-clip: border-box;
  min-height: 200px;
  box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07) !important;
  margin-top: -130px !important;
  align-items: center;
`;

const IconContainer = styled.div`
  &:hover {
    background: ${__THIRD};
    color: white;
  }
  border: 1px solid ${__THIRD};
  border-radius: 50%;
  padding: 10px;
  transition: all 0.15s ease;
  cursor: pointer;
`;

const Paragraph = styled.p``;
const LeftCard = Card.extend`
  min-width: 25%;
`;

const RightCard = Card.extend`
  min-width: 50%;
`;

const List = styled.ul`
  list-style: none;
  padding-left: 0;
  margin-top: 0;
`;

const Element = styled.div`
  display: flex;
  align-items: center;
`;

const Bullet = styled.li`
  padding-bottom: 0.5rem !important;
`;

const Text = styled.div``;

const IContainer = styled.div`
  background-color: rgb(76, 174, 243, 0.2);
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  margin-right: 10px;
`;

class MyArticles extends Component {
  render() {
    return (
      <Parent>
        <TopContainer />
        <CardContainer>
          <LeftCard>
            <h2>Submit an Article</h2>
            <IconContainer>
              <Icon icon={'plus'} width={40} height={40} />
            </IconContainer>
            <Paragraph>Create your narrative bit by bit.</Paragraph>
            <List>
              <Bullet>
                <Element>
                  <IContainer>
                    <Icon
                      icon={'ethereum'}
                      width={15}
                      height={15}
                      color={__THIRD}
                    />
                  </IContainer>

                  <Text>Fully integrated with the Ethereum Blockchain</Text>
                </Element>
              </Bullet>

              <Bullet>
                <Element>
                  <IContainer>
                    <Icon
                      icon={'edit'}
                      width={13}
                      height={13}
                      color={__THIRD}
                    />
                  </IContainer>

                  <Text>Next-generation online editor</Text>
                </Element>
              </Bullet>

              <Bullet>
                <Element>
                  <IContainer>
                    <Icon
                      icon={'check'}
                      width={13}
                      height={13}
                      color={__THIRD}
                    />
                  </IContainer>

                  <Text>Fairly rewarded peer-review process</Text>
                </Element>
              </Bullet>
            </List>
          </LeftCard>
          <RightCard>
            <h2>Your Articles</h2>
          </RightCard>
        </CardContainer>
      </Parent>
    );
  }
}

export default MyArticles;
