import React from 'react';
import styled from 'styled-components';

const Logo = styled.img`
  width: ${props => props.width}px;
  height: auto;
`;

const EurekaLogo = props => {
  return (
    <Logo
      src={
        props.blue ? '../img/logos/eureka-blue.png' : '../img/logos/eureka-hd.png'
      }
      {...props}
    />
  );
};

export default EurekaLogo;
