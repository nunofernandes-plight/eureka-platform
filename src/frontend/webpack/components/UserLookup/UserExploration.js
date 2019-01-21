import React from 'react';
import styled from 'styled-components';
import {Card} from '../../views/Card.js';
import queryString from 'query-string';
import {getDomain} from '../../../../helpers/getDomain.mjs';
import {withRouter} from 'react-router-dom';
import GridSpinner from '../../views/spinners/GridSpinner.js';
import Icon from '../../views/icons/Icon.js';
import {__ALERT_ERROR} from '../../../helpers/colors.js';
import User from '../../views/User.js';

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const NotFoundTitle = styled.h2`
  margin-bottom: 5px;
`;

const NotFoundSubTitle = styled.p`
  margin-top: 4px;
`;

const UserContainer = styled.div`
  width: 100%;
  margin-top:-70px;
`;

const NotFound = ({address}) => {
  return (
    <NotFoundContainer>
      <NotFoundTitle>
        Ouh :( We were not able to find this user in our Server.
      </NotFoundTitle>
      <NotFoundSubTitle>
        Are you sure is the address <strong>{address}</strong> correct?
      </NotFoundSubTitle>
      <Icon icon={'404'} width={180} height={180} color={__ALERT_ERROR}/>
    </NotFoundContainer>
  );
};

class UserExploration extends React.Component {
  constructor() {
    super();
    this.state = {
      user: null,
      givenAddress: null,
      notFound: false
    };
  }

  componentDidMount() {
    const address = this.props.match.params.ethereumAddress;
    this.setState({givenAddress: this.props.match.params.ethereumAddress});
    const query = queryString.stringify({
      ethAddress: address
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
          if (response.data) {
            this.setState({user: response.data});
          } else {
            this.setState({notFound: true});
          }
        } else {
          this.setState({notFound: true});
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
        <Card>
          {this.state.notFound && this.state.givenAddress ? (
            <NotFound address={this.state.givenAddress}/>
          ) : !user ? (
            <GridSpinner/>
          ) : (
            <UserContainer>
              <User user={user} base={`${this.props.base}/${this.state.givenAddress}`}/>
            </UserContainer>
          )}
        </Card>
      </Container>
    );
  }
}

export default withRouter(UserExploration);
