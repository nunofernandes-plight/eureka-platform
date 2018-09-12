import React from 'react';
import styled from 'styled-components';
import {Card} from '../../views/Card.js';
import EditorQuerySection from './EditorQuerySection.js';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

class EditorArticles extends React.Component {
  constructor() {
    super();
    this.state = {
      query: null,
      articles: null,
      filtersActive: false
    };
  }

  handleQuery = (field, value) => {
    this.setState({[field]: value});
  };

  componentDidMount() {}

  render() {
    return (
      <Container>
        <Card width={1000} title={'Allocate articles'}>
          <EditorQuerySection
            checked={this.state.filtersActive}
            handleFilters={filtersActive => {
              this.setState({filtersActive});
            }}
            handleQuery={(field, value) => {
              this.handleQuery(field, value);
            }}
          />
        </Card>
      </Container>
    );
  }
}

export default EditorArticles;
