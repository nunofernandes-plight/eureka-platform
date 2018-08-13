import React, {Component} from 'react';
import styled from 'styled-components';
import {TopContainer} from './TopContainer.js';
import {getDomain} from '../../../helpers/getDomain.js';
import GridSpinner from '../../webpack/spinners/GridSpinner.js';

const Parent = styled.div`
  display: flex;
  flex-direction: column;
`;

class DocumentEditor extends Component {
  constructor() {
    super();
    this.state = {
      errorMessage: null,
      loading: false
    };
  }

  componentDidMount() {
    const draftId = this.props.match.params.id;
    this.setState({loading: true});
    fetch(`${getDomain()}/api/articles/drafts/${draftId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          console.log(response.data);
        } else {
          this.setState({
            errorMessage: response.error
          });
        }
        this.setState({loading: false});
      })
      .catch(err => {
        console.log(err);
        this.setState({
          errorMessage: 'Ouh. Something went wrong.',
          loading: false
        });
      });
  }
  render() {
    return (
      <div>
        {this.state.loading ? (
          <GridSpinner />
        ) : (
          <Parent>
            <TopContainer />
            Route works
          </Parent>
        )}
      </div>
    );
  }
}

export default DocumentEditor;
