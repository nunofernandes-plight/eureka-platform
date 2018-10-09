import React, {Fragment} from 'react';
import styled from 'styled-components';
import {Card} from '../views/Card.js';
import {getDomain} from '../../../helpers/getDomain.mjs';
import Roles from '../../../backend/schema/roles-enum.mjs';
import GridSpinner from '../views/spinners/GridSpinner.js';
import {Table} from '../design-components/Table/Table.js';
import Avatar from '../views/Avatar.js';
import {Email} from '../views/Email.js';
import {EthereumAddress} from '../views/Address.js';
import {Role} from '../views/Role.js';
import {Go} from './Routers/Go.js';
import {withRouter} from 'react-router-dom';

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;
class Reviewers extends React.Component {
  constructor() {
    super();
    this.state = {
      reviewers: null
    };
  }

  componentDidMount() {
    fetch(`${getDomain()}/api/users/roles?role=${[Roles.REVIEWER]}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then(response => response.json())
      .then(response => {
        this.setState({reviewers: response.data});
      })
      .catch(err => {
        console.log(err);
      });
  }

  getData = () => {
    let data = [];
    this.state.reviewers.map(reviewer => {
      data.push({
        avatar: <Avatar avatar={reviewer.avatar} width={40} height={40} />,
        email: (
          <Email
            email={reviewer.email}
            subject={'Subject required'}
            body={'Dear Reviewer, '}
          />
        ),
        address: <EthereumAddress ethereumAddress={reviewer.ethereumAddress} />,
        role: this.getRoles(reviewer.roles)
      });
    });
    return data;
  };

  getRoles = roles => {
    return roles.map(role => {
      return <Role role={role} />;
    });
  };

  render() {
    return (
      <Container>
        <Card title={'REVIEWERS'} width={'1000'}>
          <Go back {...this.props} />
          {!this.state.reviewers ? (
            <GridSpinner />
          ) : (
            <Table
              textCenter={'Role'}
              header={['', 'Email', 'Ethereum Address', 'Role']}
              data={this.getData()}
              columnWidth={['15', '30', '40', '15']}
            />
          )}
        </Card>
      </Container>
    );
  }
}

export default withRouter(Reviewers);
