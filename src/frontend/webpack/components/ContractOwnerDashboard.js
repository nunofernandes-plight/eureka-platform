import React from 'react';
import styled from 'styled-components';
import {Card} from "../views/Card.js";

class ContractOwnerDashboard extends React.Component {
  constructor() {
    super();
  }

  render() {
    return <Card width={1000} title={'Contract Owner Dashboard'} />;
  }
}

export default ContractOwnerDashboard;
