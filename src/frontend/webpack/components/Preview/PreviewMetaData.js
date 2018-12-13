import React from 'react';
import styled from 'styled-components';
import Document from '../../../../models/Document.mjs';
import {__ALERT_ERROR, __GRAY_300, __THIRD} from '../../../helpers/colors.js';
import {
  makeFieldReadable,
  renderField
} from '../Articles/Online/TextEditor/DocumentRenderer.mjs';
import PreviewStatus from '../../views/PreviewStatus.js';
import {LARGE_DEVICES} from '../../../helpers/mobile.js';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  ${LARGE_DEVICES`
    margin-top: 2em; 
    flex-direction: row; 
    flex: 1; 
    order: 1; 
    flex-wrap: wrap; 
    border-top: 1px solid ${__GRAY_300};
    padding-top: 15px;
  `};
`;

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  ${LARGE_DEVICES`
     margin: 0 25px 12px 0px;
  `};
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
    </Container>
  );
};

export default PreviewMetaData;
