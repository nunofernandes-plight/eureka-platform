import React, {Component} from 'react';
import styled from 'styled-components';
import {Row} from '../helpers/layout.js';
import EurekaLogo from './Icons/EurekaLogo.js';

const Container = Row.extend`
  min-height: 85px;
  align-items: center;
`;

const renderLeft = () => {
  return <EurekaLogo height={44} blue />;
};

const renderMiddle = () => {};

const renderRight = () => {};

class Header extends Component {
  render() {
    return (
      <Container>
        {renderLeft()}
        {renderMiddle()}
        {renderRight()}
      </Container>
    );
  }
}

export default Header;
