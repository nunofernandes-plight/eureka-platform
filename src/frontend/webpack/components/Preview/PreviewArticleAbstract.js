import React, {Fragment} from 'react';
import styled from 'styled-components';
import {renderField} from '../TextEditor/DocumentRenderer.mjs';
import {PreviewArticleTitleByField} from './PreviewArticleTitleByField.js';
import {
  FieldContainer,
  ReviewsWriterFieldContainer
} from '../Reviews/Annotations/ReviewsWriterField.js';
import ReviewsWriterContainer from '../Reviews/Annotations/WriterContainer.js';
import {tokenizeSentence} from '../Reviews/Annotations/SentenceTokenizer.js';
import GridSpinner from '../../views/spinners/GridSpinner.js';
import {CommentIcon} from '../Reviews/Annotations/CommentIcon.js';
import Icon from '../../views/icons/Icon.js';
import Sentences from './Sentences.js';

const Container = styled.div``;

const FIELD = 'abstract';

class PreviewArticleAbstract extends React.Component {
  constructor() {
    super();
    this.state = {
      onShow: null,
      annotationRef: null
    };
  }

  render() {
    const abstract =
      'Neuronal morphology is established during development. It can subsequently be modified by synaptic activity, a process known as structural plasticity. Postsynaptic compartments, such as dendritic spines or the postsynaptic membrane of the Drosophila neuromuscular junction (NMJ) (called the subsynaptic reticulum or SSR), are highly dynamic elements that grow during development, and that are subject to this type of plasticity. While it is known that the shape of postsynaptic structures is tightly coupled to synaptic function, the factors that govern the morphology and its relationship with functional plasticity are still elusive. Ral GTPase has been shown to regulate the expansion of postsynaptic membranes during development and in response to synaptic activity via the Exocyst, an octameric tethering complex conserved from yeast to human. Postsynaptic activation of Ral at the Drosophila NMJ induces Exocyst recruitment to the synapse, resulting in membrane addition and SSR growth. However, how this type of remodeling is actually achieved, remains to be determined. Given the known role of Rab GTPases in polarized delivery of vesicles, we expect that a subset of these will be required for Exocyst-dependent SSR growth. Here, by systematically evaluating the localization of the Exocyst subunit Sec5 after postsynaptic activation of each Rab GTPase, we concluded that no single Rab is able to induce Sec5 recruitment to the NMJ to same extent as Ral GTPase. This result may indicate that activation of Ral at the Drosophila NMJ is necessary to initiate the signaling cascade that controls SSR size. In addition, we describe the cellular distribution of postsynaptic active Rab GTPases, and identify putative candidates whose distribution and relationship with the Exocyst may indicate a Rab/Exocyst-dependent role in muscle and/or postsynaptic development. Altogether, this study contributes to untangle the vesicle trafficking pathway(s) that regulate SSR growth at the Drosophila NMJ.';
    return (
      <Container id={FIELD}>
        <PreviewArticleTitleByField field={FIELD} />
        <ReviewsWriterFieldContainer>
          <FieldContainer>
            <Sentences
              text={abstract}
              field={FIELD}
              isReview={this.props.isReview}
              show={this.state.onShow}
              onClick={ref => {
                this.setState({annotationRef: ref});
              }}
              onShow={i => {
                this.setState({onShow: i});
              }}
            />
          </FieldContainer>
          {this.props.isReview ? (
            <Fragment>
              <ReviewsWriterContainer
                annotations={this.props.annotations}
                annotationRef={this.state.annotationRef}
                annotationAdded={() => {
                  this.setState({annotationRef: null});
                }}
                onShow={this.state.onShow}
                field={FIELD}
                {...this.props}
              />
            </Fragment>
          ) : null}
        </ReviewsWriterFieldContainer>
      </Container>
    );
  }
}
export default PreviewArticleAbstract;
