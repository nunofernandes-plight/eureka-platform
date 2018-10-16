import React from 'react';
import styled from 'styled-components';
import TitleWithHelper from './TitleWithHelper.js';
import Icon from '../../views/icons/Icon.js';
import {__ALERT_ERROR} from '../../../helpers/colors.js';
import Author from '../../views/Author.js';

const Authors = styled.div``;
const AddAuthor = styled.div`
  &:hover {
    text-decoration: underline;
  }
  transition: 0.15s all;
  color: ${__ALERT_ERROR};
  width: 36px;
  cursor: pointer;
`;

const DocumentAuthors = props => {
  return (
    <div>
      {' '}
      <TitleWithHelper
        field="authors"
        requirement={{required: true, hint: 'this is a test rqureiaijsfijas'}}
        document={{title: 'test'}}
        title="Authors"
        id="authors"
      />
      <AddAuthor onClick={() => props.addAuthor()}>
        Edit <Icon noMove icon={'edit'} width={8} height={8} bottom={2} />
      </AddAuthor>
      <Authors>
        {props.authorsData
          ? props.authorsData.map(author => {
              return (
                <div key={author.ethereumAddress}>
                  <Author author={author} width={25} height={25} right={13} />
                </div>
              );
            })
          : null}
      </Authors>
    </div>
  );
};

export default DocumentAuthors;
