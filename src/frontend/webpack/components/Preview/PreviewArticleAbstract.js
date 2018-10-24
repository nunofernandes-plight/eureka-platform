import React from 'react';
import styled from 'styled-components';
import {renderField} from '../TextEditor/DocumentRenderer.mjs';
import {PreviewArticleTitleByField} from './PreviewArticleTitleByField.js';
import {
  FieldContainer,
  ReviewsWriterFieldContainer
} from '../Reviews/Annotations/ReviewsWriterField.js';
import ReviewsWriterContainer from '../Reviews/Annotations/WriterContainer.js';

const Container = styled.div``;

const Abstract = FieldContainer.extend``;

const PreviewArticleAbstract = ({document, isReview, ...otherProps}) => {
  const field = 'abstract';
  let abstract = renderField(document, field);
  // DUMMY DATA
  abstract =
    'African sleeping sickness is a tropical disease caused by Trypanosoma brucei gambiense or T. b. rhodesiense. Both subspecies are transmitted by the tsetse fly. In general, an infection is lethal without an effective treatment. We used a rodent efficacy model to test 4 compounds that had been previously identified in a novel in vitro screen as activators of parasite differentiation from bloodstream towards procyclic forms. The 4 compounds were trypanocidal in vitro. However, none of the compounds showed trypanocidal activity in vivo. Snapshot pharmacokinetic (PK) profiles indicated that the compound exposure was too low after intraperitoneal administration, which explains the lack of efficacy.';

  return (
    <Container id={field}>
      <PreviewArticleTitleByField field={field} />
      <ReviewsWriterFieldContainer>
        <Abstract>{abstract}</Abstract>
        {isReview ? (
          <ReviewsWriterContainer
            field={field}
            {...otherProps}
            onClick={() => {
              alert('sküüüü');
            }}
          />
        ) : null}
      </ReviewsWriterFieldContainer>
    </Container>
  );
};
export default PreviewArticleAbstract;
