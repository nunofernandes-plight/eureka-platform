import React from 'react';
import styled from 'styled-components';
import queryString from 'query-string';
import {getDomain} from '../../../helpers/getDomain.js';
import Author from '../views/Author.js';
import GridSpinner from '../views/spinners/GridSpinner.js';

class AuthorLookup extends React.Component {
  constructor() {
    super();
    this.state = {
      data: null
    };
  }

  componentDidMount() {
    const query = queryString.stringify({
      ethAddress: this.props.addresses
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
          let data = Array.isArray(response.data)
            ? response.data
            : [response.data];
          this.setState({data});
        }
      })
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    return (
      <div>
        {this.state.data ? (
          <div>
            {this.state.data.map((author, i) => {
              return <Author key={i} author={author} {...this.props} />;
            })}
          </div>
        ) : (
          <GridSpinner />
        )}
      </div>
    );
  }
}
export default AuthorLookup;
