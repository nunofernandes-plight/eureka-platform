import React from 'react';
import {Route} from 'react-router';
import {Redirect} from 'react-router-dom';
import {Card, CardTitle} from '../../views/Card.js';
import MyDrafts from '../Articles/Online/MyDrafts.js';
import styled from 'styled-components';
import {DraftsNavPillRoutes} from './DraftsNavPillRoutes.js';
import NavPill from '../../views/NavPill.js';
import {__ALERT_ERROR} from '../../../helpers/colors.js';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const NavPills = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1em;
`;

export const DraftsRouter = ({base}) => {
  return (
    <Container>
      <Card title={'My Drafts'}>
        <NavPills>
          {DraftsNavPillRoutes.map((item, index) => {
            return (
              <NavPill
                small
                color={__ALERT_ERROR}
                name={item.name}
                base={base}
                key={index}
                path={item.path}
                icon={item.icon}
                material={item.material}
                width={17}
              />
            );
          })}
        </NavPills>
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
