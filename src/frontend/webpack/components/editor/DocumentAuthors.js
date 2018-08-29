import React from 'react';
import styled from 'styled-components';
import TitleWithHelper from './TitleWithHelper.js'; 
const Authors = styled.div``;

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
      <Authors>{props.document.authors}</Authors>
    </div>
  );
};

export default DocumentAuthors;
