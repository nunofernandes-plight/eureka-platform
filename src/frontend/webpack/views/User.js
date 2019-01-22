import React from 'react';
import styled from 'styled-components';
import Avatar from './Avatar.js';
import UserRoles from './UserRoles.js';
import {__ALERT_ERROR, __GRAY_600} from '../../helpers/colors.js';
import NavPill from './NavPill.js';
import {UserLookupRoutes} from '../components/Routers/UserLookupRoutes.js';
import {Route} from 'react-router';
import UserLookupRouter from '../components/Routers/UserLookupRouter.js';

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

const Routes = styled.div`
  display: flex;
  margin-top: 15px;
`;
const User = ({user, base, address}) => {
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
      <Routes>
        {UserLookupRoutes.map((item, index) => {
          return (
            <NavPill
              small={true}
              color={__ALERT_ERROR}
              name={item.name}
              base={base}
              key={index}
              path={item.path}
              icon={item.icon}
              material={item.material}
              width={25}
              height={25}
            />
          );
        })}
      </Routes>

      <UserLookupRouter base={base} address={address} />
    </Container>
  );
};

export default User;
