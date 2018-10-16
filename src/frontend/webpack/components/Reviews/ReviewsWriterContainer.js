import React from 'react';
import styled from 'styled-components';
import {__GRAY_500} from '../../../helpers/colors.js';
import {ReviewsWriterCommentIcon} from './ReviewsWriterCommentIcon.js';
import ReviewsWriterAnnotations from './ReviewsWriterAnnotations.js';
import ReviewsWriterAnnotation from './ReviewsWriterAnnotation.js';
import UploadSpinner from '../../views/spinners/UploadSpinner.js';
import {addAnnotation, addCommunityReviewToDB} from './ReviewMethods.js';
import {withRouter} from 'react-router';
const Container = styled.div`
  flex: 1;
  display: flex;
  position: relative;
  margin-left: 3.5em;
`;

const Review = styled.div`
  display: flex;
  flex: 1;
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
        id: '2bc4408756120bd0b6fe7d65',
        field: 'title',
        text: 'This title is not properly formatted',
        date: new Date().getTime(),
        isMajorIssue: false
      },
      {
        articleVersionId: this.props.documentId,
        owner: this.props.selectedAccount.address,
        reviewId: '1bc4408756120bd0b6fe7d89',
        id: '2bc4408756120bd0b6fe7d45',
        field: 'abstract',
        text:
          'The abstract is too short. Consider to rewrite it using just 300 words.',
        date: new Date().getTime(),
        issue: 'major'
      },
      {
        articleVersionId: this.props.documentId,
        owner: this.props.selectedAccount.address,
        reviewId: '1bc4408756120bd0b6fe7d15',
        id: '2bc4408756120bd0b6fe7d63',
        field: 'abstract',
        text:
          'Your abstract does not reflect the single observation described in your article. Please rewrite it',
        date: new Date().getTime(),
        issue: 'major'
      },
      {
        articleVersionId: this.props.documentId,
        owner: this.props.selectedAccount.address,
        reviewId: '9bc4408756120bd0b6fe7d15',
        id: '8bc4408756120bd0b6fe7d63',
        field: 'figure',
        text: 'Missing caption and source',
        date: new Date().getTime(),
        isMajorIssue: false
      },
      {
        articleVersionId: this.props.documentId,
        owner: this.props.selectedAccount.address,
        reviewId: '1bc4408756120bd0b6fe7d33',
        id: '2bc4408756120bd0b6fe7d83',
        field: 'figure',
        text: 'Figure is not relevant for your study',
        date: new Date().getTime(),
        isMajorIssue: false
      },
      {
        articleVersionId: this.props.documentId,
        owner: this.props.selectedAccount.address,
        reviewId: '1bc4408756120bd0b6fe7d23',
        id: '2bc4408756120bd0b6fe7d55',
        field: 'figure',
        text: 'Missing source',
        date: new Date().getTime(),
        isMajorIssue: false
      }
    ];
    return this.setState({annotations});
  }

  addAnnotation() {
    // getAnnotations: GET (given ethereumAddress and articleVersionId)
    // createAnnotation /POST
    // editAnnotation /PUT/:annotationId
    // removeAnnotation DEL/:annotationId
    // getAllAnnotations: GET (given articleVersionId)

    const annotations = [...this.state.annotations];

    // TODO: CALL FOR BACKEND WHERE A NEW ID IS CREATED --> FRONTEND uses it for navigating between components
    const reviewId = this.props.match.params.reviewId;
    const articleVersionId = this.props.documentId;
    addAnnotation({
      articleVersionId,
      reviewId,
      field: this.props.field
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          annotations.unshift(annotation);
          this.setState({annotations});
        }
      })
      .catch(err => {
        this.setState({
          loading: false,
          errorMessage: err
        });
      });

    const annotation = {
      articleVersionId: this.props.documentId,
      owner: this.props.selectedAccount.address,
      reviewId: '1bc4408756120bd0b6fe7d86',
      id: '123456789',
      field: this.props.field,
      onChange: true,
      date: new Date().getTime()
    };
  }

  deleteAnnotation = id => {
    const annotations = [...this.state.annotations];
    const index = annotations
      .map(a => {
        return a.id;
      })
      .indexOf(id);

    if (id > -1) {
      annotations.splice(index, 1);
    }
    this.setState({annotations});
  };

  saveAnnotation = id => {
    // TODO: call backend and save annotation
  };

  render() {
    return (
      <Container
        onMouseEnter={() => {
          this.setState({showCommentIcon: true});
        }}
        onMouseLeave={() => {
          this.setState({showCommentIcon: false});
        }}
      >
        <MySeparator />
        <Review>
          <CommentIcon
            show={this.state.showCommentIcon}
            onClick={() => this.addAnnotation()}
          >
            <ReviewsWriterCommentIcon show={this.state.showCommentIcon} />
          </CommentIcon>

          {!this.state.annotations ? (
            <UploadSpinner />
          ) : (
            <ReviewsWriterAnnotations show={this.state.showCommentIcon}>
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
                      onCancel={id => {
                        this.deleteAnnotation(id);
                      }}
                      onSave={id => {
                        this.saveAnnotation(id);
                      }}
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

export default withRouter(ReviewsWriterContainer);
