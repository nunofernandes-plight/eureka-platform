import React from 'react';
import styled from 'styled-components';
import {Redirect, Route} from 'react-router';

const Container = styled.div``;

const UserLookupRouter = ({base}) => {
  return (
    <Container>
      {' '}
      <Route
        exact
        path={`${base}/encoding`}
        render={() => {
          return <h1>hello encoding asijfasjifjiasfijasfijasfijfasijjif</h1>;
        }}
      />{' '}
      <Route
        exact
        path={`${base}/publications`}
        render={() => <div>hello publications</div>}
      />{' '}
      <Route
        exact
        path={`${base}/reviews`}
        render={() => <div>hello reviews</div>}
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
