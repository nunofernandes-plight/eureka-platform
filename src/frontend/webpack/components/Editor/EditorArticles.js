import React from 'react';
import styled from 'styled-components';
import {Card} from '../../views/Card.js';
import EditorQuerySection from './EditorQuerySection.js';
import {Table} from '../../design-components/Table/Table.js';
import {getUnassignedSubmissions} from './EditorMethods.js';
import Modal from '../../design-components/Modal.js';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Articles = styled.div`
  display: flex;
  flex-direction: column;
`;

class EditorArticles extends React.Component {
  constructor() {
    super();
    this.state = {
      query: null,
      articles: null,
      filtersActive: false,
      loading: false
    };
  }

  handleQuery = (field, value) => {
    this.setState({[field]: value});
  };

  componentDidMount() {
    this.setState({loading: true});
    getUnassignedSubmissions()
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          this.setState({articles: response.data});
        } else {
          this.setState({
            errorMessage: response.error,
            loading: false
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          errorMessage: 'Ouh. Something went wrong.',
          loading: false
        });
      });
  }

  renderModals() {
    return (
      <Modal
        type={'notification'}
        toggle={isErrorMessage => {
          this.setState({errorMessage: null});
        }}
        show={this.state.errorMessage}
        title={'You got the following error'}
      >
        {this.state.errorMessage}
      </Modal>
    );
  }

  render() {
    return (
      <Container>
        {this.renderModals()}
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

          <Articles />
        </Card>
      </Container>
    );
  }
}

export default EditorArticles;
