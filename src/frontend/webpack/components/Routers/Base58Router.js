import React from 'react';
import styled from 'styled-components';
import {Redirect, Route} from 'react-router';
import Encoding from '../UserLookup/Encoding.js';

const Container = styled.div``;

const Base58Router = ({base}) => {
  return (
    <Container>
      <Route
        exact
        path={`${base}/encoding`}
        render={() => {
          return <Encoding base={`${base}/encoding`} />;
        }}
      />
      <Route
        exact
        path={`${base}/decoding`}
        render={() => {
          return <div>decoding here</div>;
        }}
      />

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

export default Base58Router;
