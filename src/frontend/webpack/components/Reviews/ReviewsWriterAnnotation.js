import React from 'react';
import styled from 'styled-components';
import AuthorLookup from '../AuthorLookup.js';
import {__GRAY_600, __GRAY_700} from '../../../helpers/colors.js';
import Icon from '../../views/icons/Icon.js';

const Container = styled.div`
  padding: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  border: none;
  border-radius: 4px;
  margin-bottom: 20px;
  margin-left: 20px;
`;

const AnnotationHeader = styled.div`
  display: flex;
  align-items: center;
`;

const AnnotationBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: 7.5px;
`;

const Text = styled.div`
  color: ${__GRAY_700};
  font-size: 11px;
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
        <AnnotationBody>
          <Text>{annotation.text}</Text>
        </AnnotationBody>
      </Container>
    );
  }
}
export default ReviewsWriterAnnotation;
