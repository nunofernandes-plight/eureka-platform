import React from 'react';
import styled from 'styled-components';
import {renderField} from '../TextEditor/DocumentRenderer.mjs';
import {PreviewArticleTitleByField} from './PreviewArticleTitleByField.js';
import {
  FieldContainer,
  ReviewsWriterFieldContainer
} from '../Reviews/Annotations/ReviewsWriterField.js';
import ReviewsWriterContainer from '../Reviews/Annotations/WriterContainer.js';
import {tokenizeSentence} from '../Reviews/Annotations/SentenceTokenizer.js';

import ReactDOM from 'react-dom';
import GridSpinner from '../../views/spinners/GridSpinner.js';

const Container = styled.div``;

const Abstract = FieldContainer.extend``;

class PreviewArticleAbstract extends React.Component {
  constructor() {
    super();
    this.state = {
      sentences: null
    };
  }
  componentDidMount() {
    /*    console.log(this.refs.abstract1.offsetHeight);*/
    // TODO: change it --> DUMMY DATA
    const document = this.props.document;
    let abstract = renderField(document, 'abstract');
    abstract =
      'African sleeping sickness is a tropical disease caused by Trypanosoma brucei gambiense or T. b. rhodesiense. Both subspecies are transmitted by the tsetse fly. In general, an infection is lethal without an effective treatment. We used a rodent efficacy model to test 4 compounds that had been previously identified in a novel in vitro screen as activators of parasite differentiation from bloodstream towards procyclic forms. The 4 compounds were trypanocidal in vitro. However, none of the compounds showed trypanocidal activity in vivo. Snapshot pharmacokinetic (PK) profiles indicated that the compound exposure was too low after intraperitoneal administration, which explains the lack of efficacy. Garden eels live in burrows from which they protrude their bodies to feed on planktonic organisms, show courtship behavior and reproduce, and in which they seek refuge from predators. Despite universal acceptance that garden eels retract into their burrows for predator avoidance, a surprising lack of published accounts of this behaviour exists. Here, opportunist observations made during shark abundance video surveys, show reactions of garden eels during encounters with potential predators and other large-bodied organisms. Brown garden eels (Heteroconger longissimus) were observed during ten encounters with larger fish, and showed variable responses to five different large-bodied species. Varied responses suggested an ability to discriminate between organisms and react according to relative predation risk and proximity. The largest reactions were in response to encounters with piscivorous teleosts, the most likely predators of garden eels. Multiple encounters with two species of sharks, both improbable predators, resulted in a less pronounced reaction, consistent across encounters but variable with proximity. An encounter with a non-predator teleost resulted in the mildest response, despite very close proximity. These observations suggest that garden eels have the ability to discriminate between large-bodied organisms, and react according to relative predation risk.';

    const sentences = tokenizeSentence(abstract);
    const sentencesHeights = [];

    // TODO: REFS IS RENDEREED AFTERWARDS
    this.setState({sentences});
  }
  render() {
    if (this.state.sentences) {
      this.state.sentences.forEach((s, i) => {
        const ref = this.refs['abstract' + i.toString()];
        if (ref) {
          console.log(ref.offsetHeight);
        }
      });
    }

    const field = 'abstract';
    return (
      <Container id={field}>
        <PreviewArticleTitleByField field={field} />
        <ReviewsWriterFieldContainer>
          <Abstract>
            {this.state.sentences ? (
              this.state.sentences.map((sentence, i) => {
                const id = field + i;
                return (
                  <span id={id} key={i} ref={id}>
                    {sentence + ' '}
                  </span>
                );
              })
            ) : (
              <GridSpinner />
            )}
          </Abstract>
          {this.props.isReview ? (
            <ReviewsWriterContainer field={field} {...this.props} />
          ) : null}
        </ReviewsWriterFieldContainer>
      </Container>
    );
  }
}
export default PreviewArticleAbstract;
