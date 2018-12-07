import React from 'react';
import styled from 'styled-components';
import {Route} from 'react-router';
import {Redirect} from 'react-router-dom';
import NavPill from '../../views/NavPill.js';
import ContractOverview from '../SmartContractOwner/ContractOverview.js';
import ContractOwnerDashboard from '../SmartContractOwner/ContractOwnerDashboard.js';
import {ContractNavPillRoutes} from './ContractNavPillRoutes.js';

const Parent = styled.div`
  display: flex;
  flex-direction: column;
`;

const NavPills = styled.div`
  display: flex;
  margin-bottom: 2em;
  justify-content: center;
`;

const Container = styled.div``;
class ContractRouter extends React.Component {
  render() {
    return (
      <Parent>
        <Container>
          <NavPills>
            {ContractNavPillRoutes.map((item, index) => {
              return (
                <NavPill
                  name={item.name}
                  base={this.props.base}
                  key={index}
                  path={item.path}
                  icon={item.icon}
                  material={item.material}
                  width={26}
                  height={26}
                />
              );
            })}
          </NavPills>
          <Route
            path={`${this.props.base}/dashboard`}
            render={() => (
              <ContractOwnerDashboard base={`${this.props.base}/dashboard`} />
            )}
          />

          <Route
            exact
            path={`${this.props.base}/overview`}
            render={() => (
              <ContractOverview base={`${this.props.base}/overview`} />
            )}
          />

          <Route
            exact
            path={`${this.props.base}`}
            render={() => <Redirect to={`${this.props.base}/dashboard`} />}
          />
        </Container>
      </Parent>
    );
  }
}

export default ContractRouter;
