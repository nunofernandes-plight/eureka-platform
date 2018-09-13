import React from 'react';
import styled from 'styled-components';
import Avatar from './Avatar.js';
import {__GRAY_100} from '../../helpers/colors.js';

const Address = styled.div`
  font-weight: bold;
`;

const AuthorCredentials = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Email = styled.div`
  font-size: 12px;
`;

const AuthorContainer = styled.div`
  display: flex;
  align-items: center;
  padding: ${props => (props.padding !== undefined ? props.padding : '12')};
  border-bottom: 1px solid ${__GRAY_100};
  width: 100%;
`;

const Author = props => {
  const author = props.author;
  return (
    <AuthorContainer padding={props.padding}>
      <Avatar avatar={author.avatar} {...props} />
      <AuthorCredentials>
        <Address>{author.ethereumAddress}</Address>
        <Email>{author.email}</Email>
      </AuthorCredentials>
    </AuthorContainer>
  );
};

export default Author;
