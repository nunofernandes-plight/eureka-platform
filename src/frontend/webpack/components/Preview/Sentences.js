import React, {Fragment} from 'react';
import styled from 'styled-components';
import {FieldContainer} from '../Reviews/Annotations/ReviewsWriterField.js';
import {CommentIcon} from '../Reviews/Annotations/CommentIcon.js';
import {tokenizeSentence} from '../Reviews/Annotations/SentenceTokenizer.js';

const Circle = styled.div`
  position: absolute;
  top: ${props => props.top}px;
  margin-top: ${props => props.marginTop}px;
  right: -65px;
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
          offsetTop: null
        };
      })
    };
  }

  componentDidMount() {
    const sentences = [...this.state.sentences];
    this.setState({
      sentences: sentences.map((s, i) => {
        const ref = this.refs[`${this.props.field}${i}`];
        const offsetTop = ref.offsetTop;
        return {
          text: s.text,
          offsetTop
        };
      })
    });
  }

  render() {
    return this.state.sentences.map((sentence, i) => {
      const refId = this.props.field + i;
      let marginTop = 0;

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
                this.props.onClick(this[`${this.props.field}${i}`]);
              }}
              innerRef={ref => (this[refId] = ref)}
            >
              {this.props.show === i ? <CommentIcon show={true} /> : null}
            </Circle>
          ) : null}
          <span
            id={refId}
            key={i}
            ref={refId}
            className={this.props.show === i ? 'highlightSpan' : null}
          >
            {sentence.text + ' '}
          </span>
        </Fragment>
      );
    });
  }
}

export default Sentences;
