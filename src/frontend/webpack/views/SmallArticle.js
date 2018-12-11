import React from 'react';
import styled from 'styled-components';
import Avatar from './Avatar.js';
import {__FIFTH, __GRAY_100, __GRAY_600} from '../../helpers/colors.js';
import {EthereumAddress} from './Address.js';
import {Email} from './Email.js';
import {ArticleTitle} from './ArticleTitle.js';
import Icon from './icons/Icon.js';

const ArticleInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 10px;
`;

const ArticleContainer = styled.div`
  display: flex;
  align-items: center;
  padding: ${props => (props.padding !== undefined ? props.padding : '12px')};
  font-size: ${props => props.fontSize};
  border-bottom: 1px solid ${__GRAY_100};
  width: 100%;
`;

const AuthorsList = styled.div``;

const SmallArticle = props => {
  const article = props.article;
  const fontSize = props.fontSize ? props.fontSize + 'px' : 'inherit';
  return (
    <ArticleContainer padding={props.padding} fontSize={fontSize}>
      <Icon icon={'file'} width={28} height={28} color={__GRAY_600} noMove noPointer/>
      <ArticleInfo>
        {!article.title.blocks[0].text ? null : (
          <ArticleTitle
            article={article}
            fontSize={'16px'}
          />
        )}
        {!article.authors ? null : (
          <AuthorsList>
            {'by '}
            {article.authors.map((a, index) => {
              return (
                <EthereumAddress
                  ethereumAddress={a}
                  fontSize={fontSize}
                  noDecoration
                  fontWeight={'normal'}
                  index={index}
                  listLength={article.authors.length}
                />
              );
            })}
          </AuthorsList>
        )}
      </ArticleInfo>
    </ArticleContainer>
  );
};

export default SmallArticle;
