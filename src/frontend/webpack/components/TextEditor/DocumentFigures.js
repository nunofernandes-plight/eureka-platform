import React from 'react';
import styled from 'styled-components';
import {fromS3toCdn} from '../../../../helpers/S3UrlConverter.js';
import DropZoneHandler from './DropZoneHandler.js';
import DocumentFiguresRenderer from './DocumentFiguresRenderer.js';
import TitleWithHelper from './TitleWithHelper.js';

const FiguresFlex = styled.div`
  display: flex;
  align-items: center;
`;

const DocumentFigures = props => {
  return (
    <div>
      {' '}
      <TitleWithHelper
        field="Figure"
        document={props.document}
        requirement={{required: true, hint: 'this is a test rqureiaijsfijas'}}
        title="Figure"
        id="figure"
      />
      <FiguresFlex>
        <DropZoneHandler
          onChangeFigure={f => {
            let figures = props.document.figure ? props.document.figure : [];
            let figure = f.contents[0];
            figure.cdn = fromS3toCdn(f.contents[0].url, 'max-w=700&fm=png');
            figures.push(figure);

            props.updateDocument({
              document: {
                ...props.document,
                figure: figures
              }
            });
          }}
        />
        <DocumentFiguresRenderer
          figures={props.document.figure}
          onDelete={index => {
            const newFigure = props.document.figure.filter(
              (c, i) => i !== index
            );
            props.updateDocument({
              document: {
                ...props.document,
                figure: newFigure
              }
            });
          }}
        />
      </FiguresFlex>
    </div>
  );
};

export default DocumentFigures;
