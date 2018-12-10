import React from 'react';
import styled from 'styled-components';
import {
  __ALERT_DANGER,
  __ALERT_ERROR,
  __ALERT_WARNING,
  __THIRD
} from '../../../helpers/colors.js';
import DashboardCardTopIcon from './DashboardCardTopIcon.js';
import DashboardSubCard from './DashboardSubCard.js';
import connect from 'react-redux/es/connect/connect.js';

export const DashboardCardContainer = styled.div`
  margin: 20px;
  display: flex;
  flex-direction: column;
  padding: 1em;
  background: #fff;
  box-shadow: 0 1px 3px rgba(50, 50, 93, 0.15), 0 1px 0 rgba(0, 0, 0, 0.02);
  word-wrap: break-word;
  border-radius: 6px;
  position: relative;
  width: 100%;
  color: ${__THIRD};
  height: ${props => (props.height ? props.height : '100%')};
`;

export const DashboardCardTitle = styled.h2`
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${__ALERT_ERROR};
`;

const SubCards = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;

export const getDashboardColor = title => {
  if (title === 'Articles') {
    return `linear-gradient(40deg, ${__ALERT_ERROR}, ${__ALERT_WARNING})`;
  }
  if (title === 'Reviews') {
    return `linear-gradient(40deg, ${__ALERT_DANGER}, ${__ALERT_ERROR})`;
  }
};

const mapStateToProps = state => ({
  user: state.userData.data
});

const DashBoardCard = connect(mapStateToProps)(({stat}) => {
  const color = getDashboardColor(stat.title);
  return (
    <DashboardCardContainer>
      <DashboardCardTopIcon icon={stat.icon} color={color} />
      <DashboardCardTitle>{stat.title}</DashboardCardTitle>
      <SubCards>
        {stat.categories.map((cat, i) => {
          return (
            <DashboardSubCard
              key={i}
              category={cat}
              index={i}
              color={color}
              title={stat.title}
            />
          );
        })}
      </SubCards>
    </DashboardCardContainer>
  );
});

export default DashBoardCard;
