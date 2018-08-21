import React, {Component} from 'react';
import styled from 'styled-components';
import {Route} from 'react-router';
import {Redirect} from 'react-router-dom';
import MyDrafts from './MyDrafts.js';

const Parent = styled.div`
  display: flex;
  flex-direction: column;
`;

const CardContainer = styled.div`
  transition: all 0.5s;
  display: flex;
  max-width: 1200px;
  justify-content: center;
  margin: 0 auto;
`;

class MyArticles extends Component {
  constructor() {
    super();
  }

  componentDidMount() {}

  render() {
    return (
      <Parent>
        <CardContainer>
          <Route
            exact
            path={`${this.props.base}/drafts`}
            render={() => <MyDrafts base={`${this.props.base}/drafts`} />}
          />

          <Route
            exact
            path={`${this.props.base}`}
            render={() => <Redirect to={`${this.props.base}/drafts`} />}
          />
        </CardContainer>
      </Parent>
    );
  }
}

export default MyArticles;
