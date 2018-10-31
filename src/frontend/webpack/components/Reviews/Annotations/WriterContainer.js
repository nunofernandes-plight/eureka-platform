import React from 'react';
import styled from 'styled-components';
import {
  __GRAY_200,
  __GRAY_400,
  __GRAY_500
} from '../../../../helpers/colors.js';
import {CommentIcon} from './CommentIcon.js';
import Annotations from './Annotations.js';
import Annotation from './Annotation.js';
import UploadSpinner from '../../../views/spinners/UploadSpinner.js';
import {
  addAnnotation,
  deleteAnnotation,
  getAnnotations,
  saveAnnotation
} from '../ReviewMethods.js';
import {withRouter} from 'react-router';
import EurekaRotateSpinner from '../../../views/spinners/EurekaRotateSpinner.js';

const Container = styled.div`
  flex: 1;
  display: flex;
  position: relative;
  margin-left: 1.5em;
`;

const Review = styled.div`
  display: flex;
  flex: 1;
  border-left: 1px dashed ${__GRAY_400};
`;

class WriterContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      showCommentIcon: false,
      refs: null
    };
  }

  componentDidUpdate(nextProps) {
    if (nextProps.refs) {
      this.setState({refs: nextProps.refs});
      console.log(nextProps.refs);
      this.props.updateRefs();
    }
  }

  render() {
    return (
      <Container>
        {!this.state.refs ? (
          <h4>Handle the case that field HAS NO SENTENCES!!!</h4>
        ) : (
          <Review>
            <Annotations show={this.state.showCommentIcon}>
              {' '}
              {this.props.annotations
                .filter(a => {
                  return a.field === this.props.field;
                })
                .map((annotation, index) => {
                  const ref = this.state.refs[annotation.sentenceId];
                  console.log(ref);
                  return (
                    <Annotation
                      annotation={annotation}
                      key={index}
                      onCancel={id => {
                        this.props.onCancel(id);
                      }}
                      onSave={id => {
                        this.props.onSave(id);
                      }}
                      onDelete={id => {
                        this.props.onDelete(id);
                      }}
                      onEdit={id => {
                        this.props.onEdit(id);
                      }}
                      onChange={(id, text) => {
                        this.props.onChange(id, text);
                      }}
                    />
                  );
                })}
            </Annotations>
          </Review>
        )}
      </Container>
    );
  }
}

export default withRouter(WriterContainer);
