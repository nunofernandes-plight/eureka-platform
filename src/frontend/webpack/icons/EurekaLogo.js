import React from 'react';
import styled from 'styled-components';

const Logo = styled.img`
  height: ${props => (props.height ? props.height + 'px' : null)};
  width: ${props => (props.width ? props.width + 'px' : null)};
`;

const renderLogo = props => {
  if (props.blue) {
    return <Logo src="../img/logos/eureka-blue.png" {...props} />;
  }
  if (props.blueNoLogo) {
    return <Logo src="../img/logos/eureka-blue-no-logo.png" {...props} />;
  } else if (props.white) {
    return <Logo src="../img/logos/eureka-white.png" {...props} />;
  } else {
    return <Logo src="../img/logos/eureka-hd.png" {...props} />;
  }
};

const EurekaLogo = props => {
  return <div>{renderLogo(props)}</div>;
};

export default EurekaLogo;
