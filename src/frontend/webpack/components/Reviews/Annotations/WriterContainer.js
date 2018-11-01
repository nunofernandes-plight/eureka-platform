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

const AnnotationGroup = styled.div`
  position: absolute;
  top: ${props => props.top}px;
  display: flex;
  width: 100%;
`;

class WriterContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      showCommentIcon: false
    };
  }

  getMap() {
    let map = {};
    if (this.props.sentences) {
      this.props.annotations.forEach(annotation => {
        const pseudoRef = this.props.sentences.find(s => {
          return s.id === annotation.sentenceId;
        });
        const key = pseudoRef.offsetTop;
        if (!map[key]) {
          map[key] = [];
        }
        map[key].push(annotation);
      });
    }

    return map;
  }

  render() {
    const map = this.getMap();
    console.log(map);
    return (
      <Container>
        <Review>
          <Annotations show={this.state.showCommentIcon}>
            {Object.keys(map).map(key => {
              const group = map[key];
              return (
                <AnnotationGroup top={key}>
                  {group.map(annotation => {
                    return (
                      <Annotation
                        annotation={annotation}
                        key={annotation._id}
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
                </AnnotationGroup>
              );
            })}
          </Annotations>
        </Review>
      </Container>
    );
  }
}

export default withRouter(WriterContainer);
