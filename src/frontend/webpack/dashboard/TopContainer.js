import React from 'react';
import styled from 'styled-components';
import {__MAIN, __SECOND, __THIRD} from '../../helpers/colors.js';
import Avatar from '../Header/Avatar.js';
import MetaMaskLabel from '../views/MetaMaskLabel.js';

export const Container = styled.div`
  min-height: 353px;
  background: linear-gradient(
    150deg,
    ${__THIRD} 15%,
    ${__SECOND} 70%,
    ${__MAIN} 94%
  );
  position: relative;
  z-index: -10;
`;

const BallContainer = styled.div`
  position: absolute;
  width: 100%;
`;

const Ball = styled.span`
  left: ${props => (props.left ? props.left : null)}px;
  right: ${props => (props.right ? props.right : null)}px;
  top: ${props => props.top}px;
  width: ${props => props.width}px;
  height: ${props => props.width}px;
  border-radius: 50%;
  position: absolute;
  background: ${props => `rgba(255, 255, 255, ${props.intensity})`};
`;

const Profile = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
`;

export const TopContainer = props => {
  return (
    <Container>
      <Profile>
        <div style={{display: 'flex', marginTop: '12px'}}>
          <MetaMaskLabel metaMaskStatus={props.metaMaskStatus} />
          <Avatar
            avatar={props.user.avatar}
            width={40}
            height={40}
            right={15}
          />
        </div>
      </Profile>
      <BallContainer>
        <Ball left={50} top={20} width={120} intensity={0.07} />
        <Ball left={160} top={130} width={90} intensity={0.2} />
        <Ball left={400} top={90} width={120} intensity={0.15} />
        <Ball left={670} top={23} width={55} intensity={0.1} />
        <Ball left={720} top={50} width={60} intensity={0.05} />
        <Ball right={200} top={180} width={150} intensity={0.15} />
        <Ball right={600} top={60} width={200} intensity={0.3} />
        <Ball right={280} top={50} width={100} intensity={0.08} />
        <Ball right={340} top={80} width={70} intensity={0.18} />
      </BallContainer>
    </Container>
  );
};
