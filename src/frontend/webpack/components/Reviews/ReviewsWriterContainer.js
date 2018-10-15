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
    await this.getAllAnnotations();
  }

  // TODO: call back end and get information from there. At the moment: Dummy data
  getAllAnnotations() {
    const annotations = [
      {
        articleVersionId: this.props.documentId,
        owner: this.props.selectedAccount.address,
        reviewId: '1bc4408756120bd0b6fe7d64',
        annotationId: '2bc4408756120bd0b6fe7d65',
        field: 'title',
        annotation: 'This title is not properly formatted',
        issue: 'minor'
      },
      {
        articleVersionId: this.props.documentId,
        owner: this.props.selectedAccount.address,
        reviewId: '1bc4408756120bd0b6fe7d89',
        annotationId: '2bc4408756120bd0b6fe7d45',
        field: 'abstract',
        annotation:
          'The abstract is too short. Consider to rewrite it using just 300 words.',
        issue: 'major'
      },
      {
        articleVersionId: this.props.documentId,
        owner: this.props.selectedAccount.address,
        reviewId: '1bc4408756120bd0b6fe7d15',
        annotationId: '2bc4408756120bd0b6fe7d63',
        field: 'abstract',
        annotation:
          'Your abstract does not reflect the single observation described in your article. Please rewrite it',
        issue: 'major'
      },
      {
        articleVersionId: this.props.documentId,
        owner: this.props.selectedAccount.address,
        reviewId: '9bc4408756120bd0b6fe7d15',
        annotationId: '8bc4408756120bd0b6fe7d63',
        field: 'figure',
        annotation: 'Missing caption and source',
        issue: 'minor'
      },
      {
        articleVersionId: this.props.documentId,
        owner: this.props.selectedAccount.address,
        reviewId: '1bc4408756120bd0b6fe7d33',
        annotationId: '2bc4408756120bd0b6fe7d83',
        field: 'figure',
        annotation: 'Figure is not relevant for your study',
        issue: 'minor'
      },
      {
        articleVersionId: this.props.documentId,
        owner: this.props.selectedAccount.address,
        reviewId: '1bc4408756120bd0b6fe7d23',
        annotationId: '2bc4408756120bd0b6fe7d55',
        field: 'title',
        annotation: 'Missing source',
        issue: 'minor'
      }
    ];
    return this.setState({annotations});
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

          {!this.state.annotations ? (
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
