import React from 'react';
import styled from 'styled-components';
import {renderField} from '../TextEditor/DocumentRenderer.mjs';
import {PreviewArticleTitleByField} from './PreviewArticleTitleByField.js';

const Container = styled.div``;

const PreviewArticleAbstract = ({document}) => {
  const abstract = renderField(document, 'abstract');
  return (
    <Container>
      <PreviewArticleTitleByField field={'abstract'} />
    </Container>
  );
};
export default PreviewArticleAbstract;
