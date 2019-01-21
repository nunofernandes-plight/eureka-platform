import React from 'react';
import styled from 'styled-components';
import {Role} from './Role.js';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const UserRoles = ({roles}) => {
  return (
    <Container>
      {roles.map((role, i) => {
        return <Role role={role} key={i} />;
      })}
    </Container>
  );
};

export default UserRoles;
