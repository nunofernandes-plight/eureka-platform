import React from 'react';
import styled from 'styled-components';
import {Role} from './Role.js';
import {__FIFTH, __GRAY_100, __GRAY_200, __THIRD} from '../../helpers/colors.js';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const RoleContainer = styled.div`
  display: flex;
`;

const Separator = styled.div`
  width: 1px;
  background: ${__GRAY_200};
`;

const UserRoles = ({roles}) => {
  return (
    <Container>
      {roles.map((role, i) => {
        return (
          <RoleContainer>
            <Role role={role} key={i} />
            {i !== roles.length - 1 ? <Separator /> : null}
          </RoleContainer>
        );
      })}
    </Container>
  );
};

export default UserRoles;
