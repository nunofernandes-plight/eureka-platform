import React, {Fragment} from 'react';
import styled from 'styled-components';
import AuthorLookup from '../../AuthorLookup.js';
import {__GRAY_500, __GRAY_700} from '../../../../helpers/colors.js';
import Icon from '../../../views/icons/Icon.js';
import AnnotationEditor from './AnnotationEditor.js';
import moment from 'moment';
import AnnotationMenu from './AnnotationMenu.js';

const Container = styled.div`
  padding: ${props => (props.show ? 10 : 0)}px;
  box-shadow: ${props => (!props.show ? null : '0 1px 3px rgba(0, 0, 0, 0.3)')};
  border: none;
  border-radius: 4px;
  margin-bottom: 12px;
  top: ${props => props.top}px;
  position: absolute;
  width: 100%;
`;

const AnnotationHeader = styled.div`
  display: flex;
  align-items: center;
`;

const AnnotationBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 4px;
`;

const Text = styled.div`
  color: ${__GRAY_700};
  font-size: 11px;
  word-break: break-all;
`;

const Date = styled.div`
  font-size: 10px;
  padding: 0 4px;
  color: ${__GRAY_500};
`;

const Menu = styled.div`
  margin-left: auto;
`;
class Annotation extends React.Component {
  constructor() {
    super();
    this.state = {
      showMenu: false,
      showAnnotation: false
    };
  }

  async componentDidMount() {}

  toggle() {
    const showMenu = !this.state.showMenu;
    this.setState({showMenu});
  }

  performMenuAction(actionType, annotationId) {
    if (actionType === 'edit') {
      this.props.onEdit(annotationId);
    } else if (actionType === 'delete') {
      this.props.onDelete(annotationId);
    } else {
      alert('Action is not a valid action');
    }
  }

  render() {
    const annotation = this.props.annotation;
    return (
      <Container
        show={this.state.showAnnotation}
        top={this.props.top}
        onMouseEnter={() => {
          this.setState({showAnnotation: true});
        }}
        onMouseLeave={() => {
          this.setState({showAnnotation: false});
        }}
      >
        {this.state.showAnnotation ? (
          <Fragment>
            {' '}
            <AnnotationHeader>
              <AuthorLookup
                addresses={annotation.owner}
                right={5}
                width={23}
                height={23}
                noAddress
                fontSize={10}
                padding={'5px'}
              />

              <Menu>
                <Icon
                  icon={'material'}
                  material={'more_vert'}
                  width={17}
                  height={17}
                  color={__GRAY_700}
                  onClick={() => {
                    this.toggle();
                  }}
                />
              </Menu>

              <AnnotationMenu
                visible={this.state.showMenu}
                onClickInside={() => {
                  this.setState({showMenu: true});
                }}
                onClickOutside={() => {
                  this.setState({showMenu: false});
                }}
                action={actionType => {
                  this.performMenuAction(actionType, annotation._id);
                }}
              />
            </AnnotationHeader>
            <Date> {moment(annotation.updated).calendar()}</Date>
            <AnnotationBody>
              {annotation.onChange ? (
                <AnnotationEditor
                  id={annotation._id}
                  annotation={annotation}
                  onCancel={id => {
                    this.props.onCancel(id);
                  }}
                  onSave={id => {
                    this.props.onSave(id);
                  }}
                  onChange={(id, text) => {
                    this.props.onChange(id, text);
                  }}
                />
              ) : (
                <Text>{annotation.text}</Text>
              )}
            </AnnotationBody>
          </Fragment>
        ) : (
          <AuthorLookup
            addresses={annotation.owner}
            right={5}
            width={23}
            height={23}
            noAddress
            noEmail
            fontSize={10}
            padding={'5px'}
          />
        )}
      </Container>
    );
  }
}
export default Annotation;
