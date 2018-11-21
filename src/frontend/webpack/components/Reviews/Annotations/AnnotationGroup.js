import React from 'react';
import styled from 'styled-components';
import Annotation from './Annotation.js';
import Icon from '../../../views/icons/Icon.js';
import {__GRAY_700} from '../../../../helpers/colors.js';

const Container = styled.div`
  position: absolute;
  top: ${props => props.top}px;
  width: 100%;
  display: flex;
  flex: 1;
  flex-wrap: wrap;
`;
const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
class AnnotationGroup extends React.Component {
  constructor() {
    super();
    this.state = {
      show: false
    };
  }

  componentDidMount() {}

  render() {
    return (
      <Container top={this.props.top}>
        {this.state.show ? (
          <InnerContainer
            onMouseLeave={() => {
              this.setState({show: false});
            }}
          >
            {this.props.group.map(annotation => {
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
          </InnerContainer>
        ) : (
          <div
            style={{
              zIndex: 1,
              padding: '0px 10px',
              borderRadius: '5px',
              boxShadow:
                '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)'
            }}
          >
            <Icon
              onMouseEnter={() => {
                this.setState({show: true});
              }}
              icon={'annotation'}
              width={14}
              height={14}
              color={__GRAY_700}
            />
          </div>
        )}
      </Container>
    );
  }
}
export default AnnotationGroup;
