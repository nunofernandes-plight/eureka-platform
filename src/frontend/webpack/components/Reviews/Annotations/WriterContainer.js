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
import EurekaSpinner from '../../../views/spinners/EurekaSpinner.js';

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
      showCommentIcon: false
    };
  }

  render() {
    return (
      <Container>
        {!this.props.sentences ? (
          <EurekaRotateSpinner />
        ) : (
          <Review>
            <Annotations show={this.state.showCommentIcon} />
          </Review>
        )}
      </Container>
    );
  }
}

export default withRouter(WriterContainer);
