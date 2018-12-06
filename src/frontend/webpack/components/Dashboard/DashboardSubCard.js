import React from 'react';
import styled from 'styled-components';
import {
  __ALERT_ERROR,
  __ALERT_WARNING,
  __FIFTH,
  __GRAY_100,
  __GRAY_200,
  __GRAY_400,
  __GRAY_500,
  __GRAY_600,
  __MAIN,
  __THIRD
} from '../../../helpers/colors.js';
import Icon from '../../views/icons/Icon.js';
import {Link} from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 130px;
  min-width: 95%;
  border-radius: 4px;
  margin: 25px 15px;
  box-shadow: 0 1px 3px rgba(50, 50, 93, 0.15), 0 1px 0 rgba(0, 0, 0, 0.02);
  padding: 1em;
  border: 1px solid ${__GRAY_100};
`;
const LinkContainer = styled.div`
  margin-top: auto;
  border-top: 1px solid ${__GRAY_200};
  color: ${__GRAY_600};
`;

const Title = styled.div`
  font-size: 12px;
  font-style: italic;
  color: ${__GRAY_600};
  text-transform: lowercase;
  margin-left: 2px;
`;

const Number = styled.h1`
  margin: 0;
  color: white;
  font-size: 24px;
`;

const IconContainer = styled.div`
  background: ${`linear-gradient(40deg, ${__THIRD}, ${__MAIN})`};
  width: 50px;
  height: 50px;
  padding: 10px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
`;

const MyLink = styled(Link)`
  transition: 0.3s all ease-in-out;
  cursor: pointer;
  margin-top: 4px;
  color: ${__ALERT_ERROR};
  font-size: 12px;
  text-decoration: none;
`;

const DashboardSubCard = ({category}) => {
  return (
    <Container>
      <Header>
        <Title>{category.title}</Title>{' '}
        <IconContainer>
          <Number>{category.total}</Number>
        </IconContainer>
      </Header>
      <LinkContainer>
        <MyLink to={'tbd'}>todo insert link here</MyLink>
      </LinkContainer>
    </Container>
  );
};

export default DashboardSubCard;
