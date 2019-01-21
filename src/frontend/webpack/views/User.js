import React from 'react';
import styled from 'styled-components';
import Avatar from './Avatar.js';
import UserRoles from './UserRoles.js';
import {Email} from './Email.js';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const User = ({user}) => {
  return (
    <Container>
      <Avatar avatar={user.avatar} width={135} height={135} />
      <Email
        email={user.email}
        fontSize={'20px'}
        noDecoration
        style={{margin: 14}}
      />
      <UserRoles roles={user.roles} />
    </Container>
  );
};

export default User;
