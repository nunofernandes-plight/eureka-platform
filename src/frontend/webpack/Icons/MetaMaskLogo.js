import React from 'react';
import styled from 'styled-components';

const Logo = styled.img`
  height: ${props => (props.height ? props.height + 'px' : null)};
  width: ${props => (props.width ? props.width + 'px' : null)};
  margin-left: 5px;
  margin-right: 5px;
  margin-bottom: 3px;
`;

const MetaMaskLogo = props => {
  return <Logo src="../img/logos/metamask.png" {...props} />;
};

export default MetaMaskLogo;
