import React from 'react';
import styled from 'styled-components';
import {Card} from '../views/Card.js';
import queryString from 'query-string';
import {getDomain} from '../../../helpers/getDomain.mjs';
import {withRouter} from 'react-router-dom';
import Avatar from '../views/Avatar.js';
import GridSpinner from '../views/spinners/GridSpinner.js';

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

class UserExploration extends React.Component {
  constructor() {
    super();
    this.state = {
      user: null
    };
  }

  componentDidMount() {
    const ethereumAddress = this.props.match.params.ethereumAddress;
    const query = queryString.stringify({
      ethAddress: ethereumAddress
    });
    fetch(`${getDomain()}/api/users?${query}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          this.setState({user: response.data});
        } else {
          // TODO: handle USER NOT FOUND
        }
      })
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    const user = this.state.user;
    return (
      <Container>
        <Card width={'1000'} title={'User lookup'}>
          {!user ? (
            <GridSpinner />
          ) : (
            <Avatar avatar={user.avatar} width={100} height={100} />
          )}
        </Card>
      </Container>
    );
  }
}

export default withRouter(UserExploration);
