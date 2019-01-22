import React from 'react';
import styled from 'styled-components';
import {Redirect, Route} from 'react-router';
import Encoding from '../UserLookup/Encoding.js';
import Base58Router from './Base58Router.js';

const Container = styled.div`
  width: 66.7%;
`;

const UserLookupRouter = ({base}) => {
  return (
    <Container>
      <Route
        path={`${base}/address`}
        render={() => {
          return <Base58Router base={`${base}/address`} />;
        }}
      />
      <Route
        exact
        path={`${base}/publications`}
        render={() => <div>No Publications</div>}
      />
      <Route
        exact
        path={`${base}/reviews`}
        render={() => <div>No Reviews</div>}
      />
      <Route
        exact
        path={base}
        render={() => {
          return <Redirect to={`${base}/address`} />;
        }}
      />
    </Container>
  );
};

export default UserLookupRouter;
