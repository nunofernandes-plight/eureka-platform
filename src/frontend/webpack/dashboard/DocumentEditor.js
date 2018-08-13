import React, {Component} from 'react';
import styled from 'styled-components';
import {TopContainer} from './TopContainer.js';

const Parent = styled.div`
  display: flex;
  flex-direction: column;
`;

class DocumentEditor extends Component {
  render() {
    return (
      <Parent>
        <TopContainer />
        Route works
      </Parent>
    );
  }
}

export default DocumentEditor;
