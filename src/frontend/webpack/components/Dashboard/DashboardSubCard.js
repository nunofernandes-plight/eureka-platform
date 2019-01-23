import React from 'react';
import styled from 'styled-components';
import {__GRAY_200, __GRAY_600} from '../../../helpers/colors.js';
import Icon from '../../views/icons/Icon.js';
import {Link} from 'react-router-dom';
import DashboardSubCardContent from './DashboardSubCardContent.js';
import DashboardSubCardNotificationBell from './DashboardSubCardNotificationBell.js';

const SubCardContainer = styled.div`
  &:hover {
    box-shadow: 0 1px 3px rgba(50, 50, 93, 0.15), 0 1px 0 rgba(0, 0, 0, 0.02);
  }
  transition: 0.3s all ease-in-out;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 130px;
  min-width: 95%;
  border-radius: 4px;
  margin: 25px 15px;
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

/**
 *
 * @param category
 * @param index
 * @param color
 * @param title
 * @returns {*}
 * @constructor
 * TODO: add a placeholder for publications --> in the dashboard
 * TODO: how many articles a reviewer already selected for reviewing
 * TODO: recommend based on the keywords for expertise
 * TODO: link to see all articles --> based on keywords
 *
 * TODO: author perspective: add an info button for linked article --> inform people of linked articles that your article has been mentioned
 * TODO: link https://www.biorxiv.org/ and https://arxiv.org/ in our website
 */
const DashboardSubCard = ({category, index, color, title}) => {
  return (
    <SubCardContainer>
      {category.title === 'Invitations' ? (
        <DashboardSubCardNotificationBell
          color={color}
          total={category.total}
        />
      ) : null}

      <Header>
        <IconContainer color={color}>
          <Icon icon={category.icon} width={20} height={20} color={'white'} />
        </IconContainer>
        <DashboardSubCardContent
          categoryTitle={category.title}
          subTitle={category.subTitle}
          content={category.content}
          start={category.start}
          title={title}
          path={category.path}
          total={category.total}
        />
      </Header>

      <NumberContainer>
        <Number>
          In total, <strong>{category.total}</strong> {category.text}
        </Number>
      </NumberContainer>
    </SubCardContainer>
  );
};

export default DashboardSubCard;
