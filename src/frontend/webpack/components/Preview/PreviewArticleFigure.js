import React, {Fragment} from 'react';
import styled from 'styled-components';
import {Figure} from '../../views/Figure.js';
import {renderField} from '../TextEditor/DocumentRenderer.mjs';
import {PreviewArticleTitleByField} from './PreviewArticleTitleByField.js';

const FigureContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const PreviewArticleFigure = ({document}) => {
  const figures = renderField(document, 'figure');
  return (
    <FigureContainer id={'figure'}>
      <PreviewArticleTitleByField field={'figure'} />
      {figures.length === 0 ? (
        <i>No figure.</i>
      ) : (
        <Fragment>
          {figures.map(src => {
            return <Figure key={src} src={src} maxWidth={500} />;
          })}
        </Fragment>
      )}
    </FigureContainer>
  );
};
export default PreviewArticleFigure;
