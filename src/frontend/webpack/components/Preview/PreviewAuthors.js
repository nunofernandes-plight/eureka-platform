import React, {Fragment} from 'react';
import styled from 'styled-components';
import Author from '../../views/Author.js';
import queryString from 'query-string';
import {getDomain} from '../../../../helpers/getDomain.mjs';
import GridSpinner from '../../views/spinners/GridSpinner.js';
import CircleSpinner from '../../views/spinners/CircleSpinner.js';
import PulseSpinner from '../../views/spinners/PulseSpinner.js';
import SaveSpinner from '../../views/spinners/SaveSpinner.js';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

class PreviewAuthors extends React.Component {
  constructor() {
    super();
    this.state = {
      authorsData: null
    };
  }

  componentDidMount() {
    this.fetchAuthorsData();
  }

  fetchAuthorsData() {
    const query = queryString.stringify({
      ethAddress: this.props.authors
    });

    fetch(`${getDomain()}/api/users?${query}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          let authorsData = Array.isArray(response.data)
            ? response.data
            : [response.data];
          this.setState({authorsData});
        }
      })
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    return (
      <Container>
        {!this.state.authorsData ? (
          <div style={{marginTop: -30}}>
            <SaveSpinner />
          </div>
        ) : (
          <Fragment>
            {this.state.authorsData.map((author, i) => {
              return (
                <Author
                  right={15}
                  padding={'7.5px 0'}
                  key={i}
                  author={author}
                  height={35}
                  width={35}
                />
              );
            })}
          </Fragment>
        )}
      </Container>
    );
  }
}

export default PreviewAuthors;
