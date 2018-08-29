import React from 'react';
import styled from 'styled-components';
import {InputField} from '../../design-components/Inputs.js';
import {getDomain} from '../../../../helpers/getDomain.js';
import Roles from '../../../../backend/schema/roles-enum.mjs';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Users = styled.div`
  display: flex;
  flex-direction: column;
`;

const User = styled.div`
  display: flex;
`;

class DocumentAuthorsSelection extends React.Component {
  constructor() {
    super();
    this.state = {
      users: null
    };
  }

  handleInput(query) {
    if (!query) {
      this.setState({users: null});
      return;
    }
    fetch(`${getDomain()}/api/users?email=${query}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          let users = response.data;
          this.setState({
            users
          });
        }
      })
      .catch(err => {
        console.error(err);
      });
  }
  render() {
    return (
      <Container>
        <InputField
          placeholder={'Search for an email in our system'}
          onChange={e => this.handleInput(e.target.value)}
        />
        {!this.state.users ? null : (
          <Users>
            {this.state.users.map((user, index) => {
              return <User key={index}>{user.email}</User>;
            })}
          </Users>
        )}
      </Container>
    );
  }
}

export default DocumentAuthorsSelection;
