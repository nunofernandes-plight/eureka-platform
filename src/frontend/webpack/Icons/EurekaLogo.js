import React from 'react';
import styled from 'styled-components';

const Logo = styled.img`
  height: ${props => (props.height ? props.height + 'px' : null)};
  width: ${props => (props.width ? props.width + 'px' : null)};
`;

const EurekaLogo = props => {
  return (
    <Logo
      src={
        props.blue
          ? '../img/logos/eureka-blue.png'
          : '../img/logos/eureka-hd.png'
      }
      {...props}
    />
  );
};

export default EurekaLogo;
