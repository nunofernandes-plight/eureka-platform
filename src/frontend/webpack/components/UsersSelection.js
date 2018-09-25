import React, {Fragment} from 'react';
import styled from 'styled-components';
import {InputField} from '../design-components/Inputs.js';
import {getDomain} from '../../../helpers/getDomain.js';
import Avatar from '../views/Avatar.js';
import {
  __ALERT_DANGER,
  __ALERT_ERROR,
  __GRAY_100,
  __GRAY_200,
  __GRAY_300,
  __GRAY_800
} from '../../helpers/colors.js';
import {serializeSavePatch} from '../../../helpers/documentSerializer.mjs';
import Author from '../views/Author.js';
import Icon from '../views/icons/Icon.js';
import queryString from 'query-string';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 650px;
  min-height: 150px;
`;

const Searchable = styled.ul`
  padding-left: 0;
  list-style: none;
  margin: 0;
  border: 1px solid ${__GRAY_100};
  max-height: 180px;
  overflow: scroll;
`;

const User = styled.li`
  &:hover {
    background: ${__GRAY_200};
  }
  transition: 0.3s all;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 10px;
`;

const AuthorsSection = styled.div`
  border: 1px solid ${__GRAY_100};
  border-radius: 4px;
  width: 100%;
  margin-bottom: 20px;
`;

const Title = styled.h4`
  margin-top: 0;
  margin-bottom: 0;
  text-align: left;
  padding: 12px;
  font-weight: normal;
`;

const Listed = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Email = styled.div``;

const Element = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;
const TopContainer = styled.div`
  background: ${__GRAY_300};
`;

const Delete = styled.div``;

const SearchSection = styled.div``;
class UsersSelection extends React.Component {
  constructor() {
    super();
    this.state = {
      loadingUsers: false,
      users: null
    };
  }

  handleInput(query) {
    this.setState({loadingUsers: true});
    if (!query) {
      this.setState({users: null});
      return;
    }
    const myQueryString = queryString.stringify({
      email: query,
      roles: this.props.searchableRoles
    });

    fetch(`${getDomain()}/api/users?${myQueryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          this.setState({
            users: response.data
          });
        }
        this.setState({loadingUsers: false});
      })
      .catch(err => {
        console.error(err);
        this.setState({loadingUsers: false});
      });
  }

  getUserToRender(user) {
    return (
      <User
        key={user.ethereumAddress}
        onClick={() => {
          this.props.addToList(user);
        }}
      >
        <Avatar avatar={user.avatar} width={28} height={28} right={10} />
        <Email>{user.email}</Email>
      </User>
    );
  }

  renderUser(user) {
    const listed = this.props.listedUsers;
    if (listed) {
      // look if the selected user of the searchable list has been already inserted in the listed user
      if (
        !listed
          .map(u => {
            return u.ethereumAddress;
          })
          .includes(user.ethereumAddress)
      ) {
        return this.getUserToRender(user);
      }
    } else {
      return this.getUserToRender(user);
    }
  }

  renderDeleteButton(u) {
    return (
      <Delete>
        <Icon
          icon={'delete'}
          width={15}
          height={15}
          color={__ALERT_ERROR}
          right={20}
          onClick={() => {
            this.props.deleteFromList(u);
          }}
        />
      </Delete>
    );
  }

  render() {
    return (
      <Container>
        <AuthorsSection>
          <TopContainer>
            <Title>{this.props.listedTitle}</Title>
          </TopContainer>
          <Listed>
            {this.props.listedUsers
              ? this.props.listedUsers.map(u => {
                  return (
                    <Element key={u.ethereumAddress}>
                      <Author author={u} width={28} height={28} right={10} />
                      {this.renderDeleteButton(u)}
                    </Element>
                  );
                })
              : null}
          </Listed>
        </AuthorsSection>

        <SearchSection>
          <h4 style={{textAlign: 'left', marginBottom: 0}}>Search by email</h4>
          <p style={{fontSize: 10, textAlign: 'left', marginTop: 0}}>
            You’ll only be able to find a EUREKA user by their email address if
            they’ve chosen to list it publicly.{' '}
          </p>
          <InputField
            placeholder={`Search for an email in our system`}
            onChange={e => this.handleInput(e.target.value)}
          />
          {!this.state.users ? null : (
            <Searchable>
              {this.state.users.map((user, index) => {
                return <Fragment key={index}>{this.renderUser(user)}</Fragment>;
              })}
            </Searchable>
          )}
        </SearchSection>
      </Container>
    );
  }
}

export default UsersSelection;
