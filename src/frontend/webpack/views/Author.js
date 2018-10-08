import React from 'react';
import styled from 'styled-components';
import Avatar from './Avatar.js';
import {__GRAY_100} from '../../helpers/colors.js';
import {EthereumAddress} from './Address.js';
import {Email} from './Email.js';

const AuthorCredentials = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const AuthorContainer = styled.div`
  display: flex;
  align-items: center;
  padding: ${props => (props.padding !== undefined ? props.padding : '12px')};
  border-bottom: 1px solid ${__GRAY_100};
  width: 100%;
`;

const Author = props => {
  const author = props.author;
  return (
    <AuthorContainer padding={props.padding}>
      <Avatar avatar={author.avatar} {...props} />
      <AuthorCredentials>
        <EthereumAddress ethereumAddress={author.ethereumAddress} />
        <Email size={12} noDecoration email={author.email}>{author.email}</Email>
      </AuthorCredentials>
    </AuthorContainer>
  );
};

export default Author;
