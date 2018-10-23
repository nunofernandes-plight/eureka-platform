import React from 'react';
import styled, {keyframes} from 'styled-components';
import EurekaLogo from '../icons/EurekaLogo.js';

const flipHeads = keyframes`
  from { -webkit-transform: rotateY(0); -moz-transform: rotateY(0); transform: rotateY(0); }
  to { -webkit-transform: rotateY(1800deg); -moz-transform: rotateY(1800deg); transform: rotateY(1800deg); }
`;

const pulse = keyframes`
  0% {
   transform: scale(1); 
  }
  50% {
     transform: scale(1.3); 
  }
  100% {
     transform: scale(1); 
  }

`;

const Parent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  animation: ${pulse} 3s infinite;
`;

const Container = styled.div`
  border: 1px solid rgba(128, 128, 128, 0.18);
  border-radius: 50%;
  padding: 2em;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${flipHeads} 3s infinite;
`;

const Animation = styled.div`
  -webkit-animation: flipTails 3s ease-out forwards;
  -moz-animation: flipTails 3s ease-out forwards;
  -o-animation: flipTails 3s ease-out forwards;
  animation: flipTails 3s ease-out forwards;
`;

const Logo = styled.img``;

const EurekaRotateSpinner = () => {
  return (
    <Parent>
      <Container>
        <Animation>
          <EurekaLogo width={65} height={65} />
        </Animation>
      </Container>
    </Parent>
  );
};

export default EurekaRotateSpinner;
