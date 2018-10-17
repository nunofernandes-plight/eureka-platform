import React from 'react';
import styled from 'styled-components';
import {
  __ALERT_SUCCESS,
  __GRAY_200,
  __GRAY_600,
  __GRAY_700
} from '../../../helpers/colors.js';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const TextArea = styled.textarea`
  resize: none;
  overflow: auto;
  font-size: 10.5px;
  color: ${__GRAY_700};
  border: 1px solid ${__GRAY_200};
  padding: 8px;
  border-radius: 2px;
  min-height: 58px;
`;

const Button = styled.div`
  padding: 4px 8px;
  border-radius: 3px;
  cursor: pointer;
`;

const Comment = Button.extend`
  margin-left: auto;
  color: white;
  background: ${__ALERT_SUCCESS};
`;

const Cancel = Button.extend`
  margin-right: auto;
  color: ${__GRAY_600};
  background: ${__GRAY_200};
`;

const Buttons = styled.div`
  display: flex;
  margin-top: 7.5px;
  font-size: 10.5px;
`;
class ReviewsWriterAnnotationEditor extends React.Component {
  render() {
    return (
      <Container>
        <TextArea
          value={this.props.annotation.text ? this.props.annotation.text : null}
          placeholder={'Enter your annotation here..'}
          cols={'10'}
          onChange={e => {
            this.props.onChange(this.props.id, e.target.value);
          }}
        />
        <Buttons>
          <Cancel
            onClick={() => {
              this.props.onCancel(this.props.id);
            }}
          >
            Cancel
          </Cancel>
          <Comment
            onClick={() => {
              this.props.onSave(this.props.id);
            }}
          >
            Comment
          </Comment>
        </Buttons>
      </Container>
    );
  }
}

export default ReviewsWriterAnnotationEditor;
