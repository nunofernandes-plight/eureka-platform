import React from 'react';
import styled from 'styled-components';
import Avatar from './Avatar.js';
import UserRoles from './UserRoles.js';
import {
  __ALERT_ERROR,
  __FIFTH,
  __GRAY_400,
  __GRAY_600,
  __THIRD
} from '../../helpers/colors.js';
import {DraftsNavPillRoutes} from '../components/Routers/DraftsNavPillRoutes.js';
import NavPill from './NavPill.js';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Email = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 0.025em;
  color: ${__ALERT_ERROR} !important;
  margin-bottom: 5px;
`;

const TagLine = styled.div`
  color: ${__GRAY_600};
  text-align: center;
  max-width: 350px;
  margin-bottom: 15px;
`;

const HorizontalSeparator = styled.div`
  width: 15%;
  height: 2px;
  margin-top: 15px;
  background: ${__GRAY_600};
  align-self: center;
  border-radius: 15px;
`;

const User = ({user}) => {
  return (
    <Container>
      <Avatar avatar={user.avatar} width={135} height={135} />
      <Email>{user.email}</Email>
      <TagLine>
        <em>
          "Science is the key to our future, and if you don’t believe in
          science, then you are holding everyone back."
        </em>
        – <strong>Bill Nye</strong>
      </TagLine>
      <UserRoles roles={user.roles} />
      <HorizontalSeparator />

    </Container>
  );
};

export default User;
