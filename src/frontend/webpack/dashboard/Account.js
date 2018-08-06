import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  margin-bottom: 12px;
  position: relative;
  padding: 0px 10px;
  flex: 1 0 auto;
`;

class Account extends React.Component {

  componentDidMount() {

  }
  render() {
    return <Container>{this.props.address}</Container>;
  }
}

export default Account;