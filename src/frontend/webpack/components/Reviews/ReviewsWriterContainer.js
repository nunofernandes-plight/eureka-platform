import React, {Fragment} from 'react';
import styled from 'styled-components';
import {__GRAY_500, __GRAY_600} from '../../../helpers/colors.js';
import {ReviewsWriterCommentIcon} from './ReviewsWriterCommentIcon.js';
import ReviewsWriterAnnotations from './ReviewsWriterAnnotations.js';
import ReviewsWriterAnnotation from './ReviewsWriterAnnotation.js';
import UploadSpinner from '../../views/spinners/UploadSpinner.js';

const Container = styled.div`
  flex: 1;
  display: flex;
  position: relative;
  margin-left: 3.5em;
`;

const Review = styled.div`
  display: flex;
`;

const CommentIcon = styled.div`
  z-index: 100;
  margin-left: -20px;
  margin-top: 10px;
  background: ${props => (props.show ? 'white' : 'transparent')};
  transition: 0.3s ease-in-out;
  align-self: flex-start;
`;
const MySeparator = styled.div`
  display: flex;
  flex-direction: column;
  border-left: 1px dashed ${__GRAY_500};
  height: 100%;
  position: absolute;
`;

class ReviewsWriterContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      showCommentIcon: false,
      annotations: null
    };
  }

  async componentDidMount() {
    // TODO: get annotations from backend
    const annotations = await this.getAllAnnotations();
  }

  // TODO: call back end and get information from there. At the moment: Dummy data
  getAllAnnotations() {
    const annotations =  [
      {
        articleVersionId: this.props.documentId,
        reviewId: '',
        owner: '0xaosfoasfjo',
        annotationId: '5bc4408756120bd0b6235235',
        field: 'title',
        annotation: 'This title is not properly formatted',
        issue: 'major'
      }
    ];
  }

  addAnnotation() {
    // getAnnotations: GET (given ethereumAddress and articleVersionId)
    // addAnnotation /POST
    // editAnnotation /PUT/:annotationId
    // removeAnnotation DEL/:annotationId
    // getAllAnnotations: GET (given articleVersionId)
  }

  render() {
    return (
      <Container
        onMouseEnter={() => {
          this.setState({showCommentIcon: true});
        }}
        onMouseLeave={() => {
          this.setState({showCommentIcon: false});
        }}
        onClick={() => this.props.onClick()}
      >
        <MySeparator />
        <Review>
          <CommentIcon show={this.state.showCommentIcon}>
            <ReviewsWriterCommentIcon show={this.state.showCommentIcon} />
          </CommentIcon>

          {this.state.annotations ? (
            <UploadSpinner />
          ) : (
            <ReviewsWriterAnnotations>
              {' '}
              {this.state.annotations
                .filter(a => {
                  return a.field === this.props.field;
                })
                .map((annotation, index) => {
                  return (
                    <ReviewsWriterAnnotation
                      annotation={annotation}
                      key={index}
                    />
                  );
                })}
            </ReviewsWriterAnnotations>
          )}
        </Review>
      </Container>
    );
  }
}

export default ReviewsWriterContainer;
