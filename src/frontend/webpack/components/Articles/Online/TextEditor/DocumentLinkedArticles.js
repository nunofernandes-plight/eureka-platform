import React from 'react';
import styled from 'styled-components';
import TitleWithHelper from './TitleWithHelper.js';
import Icon from '../../../../views/icons/Icon.js';
import {__ALERT_ERROR} from '../../../../../helpers/colors.js';
import Author from '../../../../views/Author.js';
import SmallArticle from '../../../../views/SmallArticle.js';

const Article = styled.div``;
const AddArticle = styled.div`
  &:hover {
    text-decoration: underline;
  }
  transition: 0.15s all;
  color: ${__ALERT_ERROR};
  width: 36px;
  cursor: pointer;
`;

const DocumentLinkedArticles = props => {
  return (
    <div>
      {' '}
      <TitleWithHelper
        field="linked articles"
        requirement={{required: false, hint: 'The authors of the linked articles are rewarded for their work.'}}
        document={{title: 'Linked Articles'}}
        title="Linked Articles"
        id="linkedArticles"
      />
      <AddArticle onClick={() => props.editLinkedArticles()}>
        Edit <Icon noMove icon={'edit'} width={8} height={8} bottom={2} />
      </AddArticle>
      <Article>
        {props.linkedArticleData
          ? props.linkedArticleData.map(article => {
              return (
                <div key={article._id}>
                  <SmallArticle article={article} width={25} height={25} right={13} />
                </div>
              );
            })
          : null}
      </Article>
    </div>
  );
};

export default DocumentLinkedArticles;
