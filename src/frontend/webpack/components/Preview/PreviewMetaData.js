import React from 'react';
import styled from 'styled-components';
import Document from '../../../../models/Document.mjs';
import {__ALERT_ERROR, __GRAY_800} from '../../../helpers/colors.js';
import {renderField} from '../TextEditor/DocumentRenderer.mjs';

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
  font-size: 12.5px;
  font-weight: bold;
  margin-bottom: 0;
  margin-top: 0;
`;

const Content = styled.div`
  color: ${__GRAY_800};
  font-size: 10px;
  font-style: italic;
`;

const Field = ({doc, field, ...otherProps}) => {
  let content = renderField(doc, field);
  if (!content) content = '-';
  return (
    <FieldContainer>
      <Title>{field}</Title>
      <Content>{content}</Content>
    </FieldContainer>
  );
};

const PreviewMetaData = ({document, ...otherProps}) => {
  const fields = Document.metaDataFields();
  return (
    <Container>
      {fields.map((field, i) => {
        return <Field key={i} doc={document} field={field} />;
      })}
    </Container>
  );
};

export default PreviewMetaData;
