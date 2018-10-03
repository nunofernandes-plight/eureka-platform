import React from 'react';
import styled from 'styled-components';
import {Card} from '../views/Card.js';
import {withRouter} from 'react-router-dom';

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

class Preview extends React.Component {
  constructor() {
    super();
    this.state = {
      article: null
    };
  }

  componentDidMount() {
    const draftId = this.props.match.params.id;
    console.log(draftId);
    // TODO: call server
  }

  render() {
    return (
      <Container>
        <Card width={1000} title={'Your article'} />
      </Container>
    );
  }
}

export default withRouter(Preview);
