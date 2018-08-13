import React, {Component} from 'react';
import styled from 'styled-components';
import {TopContainer} from './TopContainer.js';

const Parent = styled.div`
  display: flex;
  flex-direction: column;
`;

class MyArticles extends Component {
  render() {
    return (
      <Parent>
        <TopContainer />asfgasfasfasfasf
      </Parent>
    );
  }
}

export default MyArticles;
