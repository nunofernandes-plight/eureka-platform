import React from 'react';
import styled from 'styled-components';
import {__GRAY_500, __GRAY_600} from '../../../helpers/colors.js';
import {ReviewsWriterCommentIcon} from './ReviewsWriterCommentIcon.js';

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
      showCommentIcon: false
    };
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
        </Review>
      </Container>
    );
  }
}

export default ReviewsWriterContainer;
