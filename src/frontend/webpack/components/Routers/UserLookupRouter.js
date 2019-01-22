import React from 'react';
import styled from 'styled-components';
import {Redirect, Route} from 'react-router';
import Encoding from '../UserLookup/Encoding.js';

const Container = styled.div`
  width: 66.7%;
`;

const UserLookupRouter = ({base}) => {
  return (
    <Container>
      <Route
        exact
        path={`${base}/encoding`}
        render={() => {
          return <Encoding base={`${base}/encoding`} />;
        }}
      />{' '}
      <Route
        exact
        path={`${base}/publications`}
        render={() => <div>No Publications</div>}
      />{' '}
      <Route
        exact
        path={`${base}/reviews`}
        render={() => <div>No Reviews</div>}
      />{' '}
      <Route
        exact
        path={base}
        render={() => {
          return <Redirect to={`${base}/encoding`} />;
        }}
      />
    </Container>
  );
};

export default UserLookupRouter;
