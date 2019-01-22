import React, {Component} from 'react';
import styled from 'styled-components';
import {Redirect, Route, withRouter} from 'react-router';
import Encoding from '../UserLookup/Encoding.js';
import {__GRAY_300} from '../../../helpers/colors.js';
import OptionPicker from '../UserLookup/OptionPicker.js';
const Container = styled.div`
  max-width: 1110px;
  border: 1px solid ${__GRAY_300};
  padding: 10px 30px 30px 30px;
  border-radius: 5px;
  margin-top: 4em;
`;

const Title = styled.h2`
  text-align: center;
`;

const MarginTop = styled.div`
  margin-top: 4em;
`;

class Base58Router extends Component {
  render() {
    let {base} = this.props;
    return (
      <Container>
        <Title>What do you want to do?</Title>
        <OptionPicker
          onChange={value => {
            this.props.history.push(`${this.props.base}/${value}`);
          }}
        />

        <MarginTop>
          <Route
            exact
            path={`${base}/encoding`}
            render={() => {
              return <Encoding base={`${base}/encoding`} />;
            }}
          />
          <Route
            exact
            path={`${base}/decoding`}
            render={() => {
              return <div>decoding here</div>;
            }}
          />
          <Route
            exact
            path={base}
            render={() => {
              return <Redirect to={`${base}/encoding`} />;
            }}
          />
        </MarginTop>
      </Container>
    );
  }
}

export default withRouter(Base58Router);
