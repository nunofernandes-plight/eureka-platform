import React from 'react';
import styled from 'styled-components';
import {__GRAY_500} from '../../../helpers/colors.js';
import {ReviewsWriterCommentIcon} from './ReviewsWriterCommentIcon.js';
import ReviewsWriterAnnotations from './ReviewsWriterAnnotations.js';
import ReviewsWriterAnnotation from './ReviewsWriterAnnotation.js';
import UploadSpinner from '../../views/spinners/UploadSpinner.js';
import {
  addAnnotation,
  addCommunityReviewToDB,
  deleteAnnotation,
  getAnnotations,
  getMyReviews,
  saveAnnotation
} from './ReviewMethods.js';
import {withRouter} from 'react-router';
import OutsideAlerter from './OutsideAlerter.js';
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
    await this.getAnnotations(this.props.match.params.reviewId);
  }

  // TODO: call back end and get information from there. At the moment: Dummy data
  getAnnotations() {
    this.setState({loading: true});
    return getAnnotations(this.props.match.params.reviewId)
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          this.setState({annotations: response.data});
        }
        this.setState({loading: false});
      })
      .catch(err => {
        this.setState({loading: false});
        console.error(err);
      });
  }

  addAnnotation() {
    // getAnnotations: GET (given ethereumAddress and articleVersionId)
    // createAnnotation /POST
    // editAnnotation /PUT/:annotationId
    // removeAnnotation DEL/:annotationId
    // getAllAnnotations: GET (given articleVersionId)

    const annotations = [...this.state.annotations];

    const reviewId = this.props.match.params.reviewId;
    // TODO: documentId is null and doesn't reflect article Version
    const articleVersionId = this.props.documentId;
    addAnnotation({
      articleVersionId,
      reviewId,
      field: this.props.field
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          let annotation = response.data;
          annotation.onChange = true;
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
  }

  deleteAnnotation = id => {
    const annotations = [...this.state.annotations];
    const index = annotations
      .map(a => {
        return a.id;
      })
      .indexOf(id);

    deleteAnnotation(annotations[index])
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          this.getAnnotations();
        }
      })
      .catch(err => {
        this.setState({
          loading: false,
          errorMessage: err
        });
      });
  };

  cancelAnnotation = id => {
    const annotations = [...this.state.annotations];
    const index = annotations
      .map(a => {
        return a.id;
      })
      .indexOf(id);

    if (annotations[index].text) {
      annotations[index].onChange = false;
      this.setState({annotations});
    } else {
      this.deleteAnnotation(id);
    }
  };

  saveAnnotation = (id, text) => {
    const annotations = [...this.state.annotations];
    const index = annotations
      .map(a => {
        return a._id;
      })
      .indexOf(id);
    annotations[index].text = text;
    saveAnnotation(annotations[index])
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          annotations[index].onChange = false;
          this.setState({annotations});
          this.getAnnotations();
        }
      })
      .catch(err => {
        this.setState({
          loading: false,
          errorMessage: err
        });
      });
  };

  editAnnotation = id => {
    console.log(id);
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
                        this.cancelAnnotation(id);
                      }}
                      onSave={(id, text) => {
                        this.saveAnnotation(id, text);
                      }}
                      onDelete={id => {
                        // this.deleteAnnotation(id);
                      }}
                      onEdit={id => {
                        this.editAnnotation(id);
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
