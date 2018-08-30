import React from 'react';
import styled from 'styled-components';
import {InputField} from '../../design-components/Inputs.js';
import {getDomain} from '../../../../helpers/getDomain.js';
import Avatar from '../../views/Avatar.js';
import {
  __GRAY_100,
  __GRAY_200,
  __GRAY_300,
  __GRAY_800
} from '../../../helpers/colors.js';
import {serializeSavePatch} from '../../../../helpers/documentSerializer.mjs';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 650px;
  min-height: 150px;
`;

const Users = styled.ul`
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

const Authors = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Address = styled.div`
  font-weight: bold;
`;

const AuthorCredentials = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Email = styled.div``;

const AuthorContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  cursor: pointer;
  border-bottom: 1px solid ${__GRAY_100};
  width: 100%;
`;
const TopContainer = styled.div`
  background: ${__GRAY_300};
`;

const SearchSection = styled.div``;
class DocumentAuthorsSelection extends React.Component {
  constructor() {
    super();
    this.state = {
      users: null,
      loadingUsers: false
    };
  }

  handleInput(query) {
    this.setState({loadingUsers: true});
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

  render() {
    return (
      <Container>
        <AuthorsSection>
          <TopContainer>
            <Title>Authors</Title>
          </TopContainer>
          <Authors>
            {this.props.authorsData
              ? this.props.authorsData.map((author, index) => {
                  return (
                    <AuthorContainer key={index}>
                      <Avatar
                        avatar={author.avatar}
                        width={28}
                        height={28}
                        right={20}
                      />
                      <AuthorCredentials>
                        <Address>{author.ethereumAddress}</Address>
                        <Email style={{fontSize: 12}}>{author.email}</Email>
                      </AuthorCredentials>
                    </AuthorContainer>
                  );
                })
              : null}
          </Authors>
        </AuthorsSection>

        <SearchSection>
          <InputField
            placeholder={'Search for an email in our system'}
            onChange={e => this.handleInput(e.target.value)}
          />
          {!this.state.users ? null : (
            <Users>
              {this.state.users.map((user, index) => {
                if (
                  !this.props.document.authors.includes(user.ethereumAddress)
                ) {
                  return (
                    <User
                      key={index}
                      onClick={() => {
                        const authors = this.props.document.authors;
                        authors.push(user.ethereumAddress);
                        this.props.updateDocument({
                          document: {
                            ...this.props.document,
                            authors
                          }
                        });
                      }}
                    >
                      <Avatar
                        avatar={user.avatar}
                        width={28}
                        height={28}
                        right={10}
                      />
                      <Email>{user.email}</Email>
                    </User>
                  );
                }
              })}
            </Users>
          )}
        </SearchSection>
      </Container>
    );
  }
}

export default DocumentAuthorsSelection;
