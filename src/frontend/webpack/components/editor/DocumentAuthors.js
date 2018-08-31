import React from 'react';
import styled from 'styled-components';
import TitleWithHelper from './TitleWithHelper.js';
import Icon from '../../views/icons/Icon.js';
import {__ALERT_ERROR} from '../../../helpers/colors.js';

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

const Address = styled.div`
  font-weight: bold;
`;

const Email = styled.div`
  font-size: 12px;
  font-weight: inherit;
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
                <div>
                  <Address>{author.ethereumAddress}</Address>{' '}
                  <Email>({author.email})</Email>
                </div>
              );
            })
          : null}
      </Authors>
    </div>
  );
};

export default DocumentAuthors;
