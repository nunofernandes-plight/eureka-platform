import React from 'react';
import styled from 'styled-components';
import {__GRAY_500} from '../../../../helpers/colors.js';
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

// TODO: this should be dynamic --> margin top based on sentence id
const MyCommentIcon = styled.div`
  z-index: 100;
  margin-left: -20px;
  margin-top: -15px;
  // background: ${props => (props.show ? 'white' : 'transparent')};
  // transition: 0.3s ease-in-out;
  align-self: flex-start;
`;

const InvisibleDiv = styled.div`
  height: ${props => (props.mouseY === 0 ? null : props.mouseY)}px;
`;

const MySeparator = styled.div`
  display: flex;
  flex-direction: column;
  border-left: 1px dashed ${__GRAY_500};
  height: 100%;
  position: absolute;
`;
const Square = styled.div`
  width: 30px;
  height: 30px;
  border: 1px solid red;
`;
class WriterContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      showCommentIcon: false,
      annotations: null,
      mouseX: null,
      mouseY: null
    };
  }

  async componentDidMount() {
    await this.getAnnotations(this.props.match.params.reviewId);
  }

  _onMouseMove(e) {
    console.log('Current Mouse Move ' + e.nativeEvent.offsetY);
    this.setState({
      mouseX: e.nativeEvent.offsetX,
      mouseY: e.nativeEvent.offsetY
    });

    this.getCorrespondingSentence(e.nativeEvent.offsetY);
  }

  getCorrespondingSentence = mouseY => {
    const sentencesHeights = this.props.sentencesHeights;
  };

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
        return a._id;
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
    const annotation = annotations.find(a => {
      return a._id === id;
    });
    if (annotation.updated) {
      this.getAnnotations();
    } else {
      this.deleteAnnotation(id);
    }
  };

  saveAnnotation = id => {
    const annotations = [...this.state.annotations];
    const annotation = annotations.find(a => {
      return a._id === id;
    });
    saveAnnotation(annotation)
      .then(response => response.json())
      .then(response => {
        if (response.success) {
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
    const annotations = [...this.state.annotations];
    const annotation = annotations.find(a => {
      return a._id === id;
    });
    if (annotation) {
      annotation.onChange = true;
    }
    this.setState({annotations});
  };

  changeAnnotation = (id, text) => {
    const annotations = [...this.state.annotations];
    const annotation = annotations.find(a => {
      return a._id === id;
    });
    if (annotation) {
      annotation.text = text;
    }
    this.setState({annotations});
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
        {/*        <MySeparator />*/}
        <Review onMouseMove={this._onMouseMove.bind(this)}>
          <div
            onMouseEnter={() => {
              console.log('Parent ' + this.state.mouseY);
            }}
          >
            <InvisibleDiv
              mouseY={this.state.mouseY}
              onMouseEnter={() => {
                console.log('InvisibleDiv ' + this.state.mouseY);
              }}
            />
            <Square
              onMouseEnter={() => {
                console.log('Square ' + this.state.mouseY);
              }}
            />
          </div>
          {/*          <MyCommentIcon
            show={this.state.showCommentIcon}
            onClick={() => this.addAnnotation()}
          >
            
            <CommentIcon show={this.state.showCommentIcon} />
          </MyCommentIcon>*/}

          {!this.state.annotations ? (
            <UploadSpinner />
          ) : (
            <Annotations show={this.state.showCommentIcon}>
              {' '}
              {this.state.annotations
                .filter(a => {
                  return a.field === this.props.field;
                })
                .map((annotation, index) => {
                  return (
                    <Annotation
                      annotation={annotation}
                      key={index}
                      onCancel={id => {
                        this.cancelAnnotation(id);
                      }}
                      onSave={id => {
                        this.saveAnnotation(id);
                      }}
                      onDelete={id => {
                        this.deleteAnnotation(id);
                      }}
                      onEdit={id => {
                        this.editAnnotation(id);
                      }}
                      onChange={(id, text) => {
                        this.changeAnnotation(id, text);
                      }}
                    />
                  );
                })}
            </Annotations>
          )}
        </Review>
      </Container>
    );
  }
}

export default withRouter(WriterContainer);
