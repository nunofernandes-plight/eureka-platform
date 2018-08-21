import React from 'react';
import styled from 'styled-components';
import {__THIRD} from '../../helpers/colors.js';
import {Card} from './Card.js';
import Icon from './icons/Icon.js';

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
  padding-left: 15px;
  padding-right: 15px;
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

const CardWithBullerIcon = props => {
  return (
    <Card width={500}>
      <h2>Submit an Article</h2>
      <IconContainer onClick={() => props.callback()}>
        <Icon icon={'plus'} width={40} height={40} />
      </IconContainer>
      <Paragraph>Create your narrative bit by bit.</Paragraph>
      <List>
        <Bullet>
          <Element>
            <IContainer>
              <Icon icon={'ethereum'} width={15} height={15} color={__THIRD} />
            </IContainer>
            <Text>Fully integrated with the Ethereum Blockchain</Text>
          </Element>
        </Bullet>
      </List>
    </Card>
  );
};

export default CardWithBullerIcon;
