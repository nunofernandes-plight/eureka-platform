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

const Container = styled.div``;

const Abstract = FieldContainer.extend``;

const Circle = styled.div`
  position: absolute;
  margin-top: -13px;
  right: -70px;
  z-index: 100000000;
  width: 42px;
  height: 42px;
`;
const FIELD = 'abstract';
class PreviewArticleAbstract extends React.Component {
  constructor() {
    super();
    const abstract =
      'African sleeping sickness is a tropical disease caused by Trypanosoma brucei gambiense or T. b. rhodesiense. Both subspecies are transmitted by the tsetse fly. In general, an infection is lethal without an effective treatment. We used a rodent efficacy model to test 4 compounds that had been previously identified in a novel in vitro screen as activators of parasite differentiation from bloodstream towards procyclic forms. The 4 compounds were trypanocidal in vitro. However, none of the compounds showed trypanocidal activity in vivo. Snapshot pharmacokinetic (PK) profiles indicated that the compound exposure was too low after intraperitoneal administration, which explains the lack of efficacy. Garden eels live in burrows from which they protrude their bodies to feed on planktonic organisms, show courtship behavior and reproduce, and in which they seek refuge from predators. Despite universal acceptance that garden eels retract into their burrows for predator avoidance, a surprising lack of published accounts of this behaviour exists. Here, opportunist observations made during shark abundance video surveys, show reactions of garden eels during encounters with potential predators and other large-bodied organisms. Brown garden eels (Heteroconger longissimus) were observed during ten encounters with larger fish, and showed variable responses to five different large-bodied species. Varied responses suggested an ability to discriminate between organisms and react according to relative predation risk and proximity. The largest reactions were in response to encounters with piscivorous teleosts, the most likely predators of garden eels. Multiple encounters with two species of sharks, both improbable predators, resulted in a less pronounced reaction, consistent across encounters but variable with proximity. An encounter with a non-predator teleost resulted in the mildest response, despite very close proximity. These observations suggest that garden eels have the ability to discriminate between large-bodied organisms, and react according to relative predation risk.';
    this.state = {
      sentences: tokenizeSentence(abstract).map(sentence => {
        return {
          text: sentence,
          offsetTop: null
        };
      }),
      onShow: null
    };
  }
  componentDidMount() {
    const sentences = [...this.state.sentences];
    let groups = new Map();
    this.setState({
      sentences: sentences.map((s, i) => {
        const ref = this.refs[`${FIELD}${i}`];
        const offsetTop = ref.offsetTop;
        return {
          text: s.text,
          offsetTop
        };
      })
    });

    console.log(groups);
  }

  render() {
    const containerId = FIELD + 'Container';
    return (
      <Container id={FIELD}>
        <PreviewArticleTitleByField field={FIELD} />
        <ReviewsWriterFieldContainer>
          <div
            style={{flex: 3, position: 'relative'}}
            id={containerId}
            ref={containerId}
          >
            {this.state.sentences.map((sentence, i) => {
              const id = FIELD + i;
              return (
                <Fragment key={i}>
                  <Circle
                    id={id}
                    index={i}
                    onMouseEnter={() => {
                      this.setState({onShow: i});
                    }}
                    innerRef={ref => (this[`${FIELD}${i}`] = ref)}
                  >
                    {this.state.onShow === i ? (
                      <CommentIcon show={true} />
                    ) : null}
                  </Circle>
                  <span
                    id={id}
                    key={i}
                    ref={id}
                    className={this.state.onShow === i ? 'highlightSpan' : null}
                  >
                    {sentence.text + ' '}
                  </span>
                </Fragment>
              );
            })}
          </div>
          {this.props.isReview ? (
            <Fragment>
              <ReviewsWriterContainer
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
