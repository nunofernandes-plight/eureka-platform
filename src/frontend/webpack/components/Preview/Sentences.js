import React, {Fragment} from 'react';
import styled from 'styled-components';
import {FieldContainer} from '../Reviews/Annotations/ReviewsWriterField.js';
import {CommentIcon} from '../Reviews/Annotations/CommentIcon.js';
import {tokenizeSentence} from '../Reviews/Annotations/SentenceTokenizer.js';

const Circle = styled.div`
  position: absolute;
  top: ${props => props.top}px;
  margin-top: ${props => props.marginTop}px;
  right: -37px;
  z-index: 100;
  width: 30px;
  height: 30px;
`;

class Sentences extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sentences: tokenizeSentence(props.text).map(sentence => {
        return {
          text: sentence,
          offsetTop: null,
          id: null
        };
      })
    };
  }

  componentDidMount() {
    let sentences = [...this.state.sentences];
    sentences = sentences.map((s, i) => {
      const ref = this.refs[`${this.props.field}${i}`];
      const offsetTop = ref.offsetTop;
      const id = ref.id;
      return {
        text: s.text,
        offsetTop,
        id
      };
    });
    this.setState({sentences});
    this.props.updateOffsets(sentences);
  }

  render() {
    return this.state.sentences.map((sentence, i) => {
      const refId = this.props.field + i;
      let marginTop = 0;

      const annotation = this.props.annotations.find(a => {
        return a.sentenceId === sentence.id;
      });

      if (i !== this.state.sentences.length - 1) {
        if (sentence.offsetTop === this.state.sentences[i + 1].offsetTop)
          marginTop = -12;
        {
        }
      }
      return (
        <Fragment key={i}>
          {this.props.isReview ? (
            <Circle
              id={refId}
              index={i}
              marginTop={marginTop}
              top={sentence.offsetTop}
              onMouseEnter={() => {
                this.props.onShow(i);
              }}
              onClick={() => {
                this.props.onClick(this[refId]);
              }}
              innerRef={ref => (this[refId] = ref)}
            >
              {this.props.show === i ? <CommentIcon show={true} /> : null}
            </Circle>
          ) : null}
          <span id={refId} key={i} ref={refId} className={this.getClass(i)}>
            {sentence.text + ' '}
          </span>
        </Fragment>
      );
    });
  }

  getClass(index) {
    if (!this.props.isReview) {
      return;
    }
    if (this.props.show === index) {
      return 'highlightSpan';
    }

    if (this.props.annotations) {
      const id = this.props.field + index;
      const ann = this.props.annotations.find(a => {
        return a.sentenceId === id;
      });
      if (ann) {
        return 'highlightedSpan';
      }
    }
  }
}

export default Sentences;
