import React from 'react';
import styled from 'styled-components';
import Document from '../../../../models/Document.mjs';
import {__ALERT_ERROR, __THIRD} from '../../../helpers/colors.js';
import {
  makeFieldReadable,
  renderField
} from '../Articles/Online/TextEditor/DocumentRenderer.mjs';
import PreviewStatus from '../../views/PreviewStatus.js';
import ArticleActions from '../../views/ArticleActions.js';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
`;

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h4`
  color: ${__ALERT_ERROR};
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 0;
  margin-top: 0;
`;

const Content = styled.div`
  color: ${__THIRD};
  font-size: 10.5px;
`;
const Metadata = styled.div`
  font-size: 10.5px;
`;

const CustomPreviewStatus = styled(PreviewStatus)`
  margin-top: 20px;
  padding-right: 25px;
`;

const Field = ({doc, field, ...otherProps}) => {
  let content = renderField(doc, field);
  if (!content) content = '-';
  return (
    <FieldContainer>
      <Title>{makeFieldReadable(field)}</Title>
      {Array.isArray(content) ? (
        <div>
          {content.map((value, i) => {
            return (
              <Metadata key={i} index={i}>
                {value}
              </Metadata>
            );
          })}
        </div>
      ) : (
        <Content>{content}</Content>
      )}
    </FieldContainer>
  );
};

const PreviewMetaData = ({article, ...otherProps}) => {
  const fields = Document.metaDataFields();
  return (
    <Container>
      {fields.map((field, i) => {
        return <Field key={i} doc={article.document} field={field} />;
      })}
      <CustomPreviewStatus status={article.articleVersionState} />
      <ArticleActions article={article} />
    </Container>
  );
};

export default PreviewMetaData;
