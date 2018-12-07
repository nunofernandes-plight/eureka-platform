import React from 'react';
import styled from 'styled-components';
import {
  __ALERT_ERROR,
  __GRAY_200,
  __GRAY_600
} from '../../../helpers/colors.js';
import Icon from '../../views/icons/Icon.js';
import {Link} from 'react-router-dom';
import DashboardSubCardContent from './DashboardSubCardContent.js';
import {EXTRA_LARGE_DEVICES} from '../../../helpers/mobile.js';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 130px;
  min-width: 95%;
  border-radius: 4px;
  margin: 25px 15px;
  box-shadow: 0 1px 3px rgba(50, 50, 93, 0.15), 0 1px 0 rgba(0, 0, 0, 0.02);
  padding: 1em;
  border: 1px solid ${__GRAY_200};
  position: relative;
`;
const NumberContainer = styled.div`
  margin-top: auto;
  border-top: 1px solid ${__GRAY_200};
  color: ${__GRAY_600};
`;

const Number = styled.div`
  font-size: 12px;
  font-style: italic;
  padding-top: 5px;
`;

const IconContainer = styled.div`
  background: ${props => props.color};
  width: 34px;
  height: 34px;
  padding: 6px;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin: 0 0 20px 0;
`;

const DashboardSubCard = ({category, index, color, title}) => {
  console.log(category.content);
  return (
    <Container>
      <Header>
        <IconContainer color={color}>
          <Icon icon={category.icon} width={20} height={20} color={'white'} />
        </IconContainer>
        <DashboardSubCardContent
          content={category.content}
          start={category.start}
          title={title}
          path={category.path}
        />
      </Header>
      <NumberContainer>
        <Number>
          In total, <strong>{category.total}</strong> {category.title}
        </Number>
      </NumberContainer>
    </Container>
  );
};

export default DashboardSubCard;
