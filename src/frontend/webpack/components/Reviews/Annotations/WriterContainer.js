import React from 'react';
import styled from 'styled-components';
import {__GRAY_400} from '../../../../helpers/colors.js';
import Annotations from './Annotations.js';
import {withRouter} from 'react-router';
import AnnotationGroup from './AnnotationGroup.js';

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
      show: false
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
    return (
      <Container>
        <Review>
          <Annotations>
            {Object.keys(map).map(key => {
              const group = map[key];
              return (
                <AnnotationGroup
                  top={key}
                  key={key}
                  group={group}
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
      </Container>
    );
  }
}

export default withRouter(WriterContainer);
