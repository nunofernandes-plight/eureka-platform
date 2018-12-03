import React from 'react';
import {Route} from 'react-router';
import {Redirect} from 'react-router-dom';
import {Card, CardTitle} from '../../views/Card.js';
import MyDrafts from '../Articles/Online/MyDrafts.js';
import styled from 'styled-components';
import Icon from '../../views/icons/Icon.js';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
export const DraftsRouter = ({base}) => {
  return (
    <Container>
      <Card title={'My Drafts'}>
        <Route
          exact
          path={`${base}/online`}
          render={() => <MyDrafts base={`${base}/online`} />}
        />

        <Route exact path={`${base}/pdfs`} render={() => <span />} />

        <Route
          exact
          path={`${base}`}
          render={() => <Redirect to={`${base}/online`} />}
        />
      </Card>
    </Container>
  );
};
