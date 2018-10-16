import React from 'react';
import styled from 'styled-components';
import AuthorLookup from '../AuthorLookup.js';
import {__GRAY_500, __GRAY_700} from '../../../helpers/colors.js';
import Icon from '../../views/icons/Icon.js';
import ReviewsWriterAnnotationEditor from './ReviewsWriterAnnotationEditor.js';
import moment from 'moment';

const Container = styled.div`
  padding: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  border: none;
  border-radius: 4px;
  margin-bottom: 12px;
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
`;

const Date = styled.div`
  font-size: 10px;
  padding: 0 4px;
  color: ${__GRAY_500};
`;

const Menu = styled.div`
  margin-left: auto;
`;
class ReviewsWriterAnnotation extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  async componentDidMount() {}

  render() {
    const annotation = this.props.annotation;
    return (
      <Container>
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
            />
          </Menu>
        </AnnotationHeader>
        <Date> {moment(annotation.date).calendar()}</Date>
        <AnnotationBody>
          {annotation.onChange ? (
            <ReviewsWriterAnnotationEditor
              id={annotation.id}
              onCancel={id => {
                this.props.onCancel(id);
              }}
              onSave={(id, text) => {
                this.props.onSave(id, text);
              }}
            />
          ) : (
            <Text>{annotation.text}</Text>
          )}
        </AnnotationBody>
      </Container>
    );
  }
}
export default ReviewsWriterAnnotation;
