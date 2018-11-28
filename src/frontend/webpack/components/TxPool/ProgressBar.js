import React from 'react';
import styled, {keyframes} from 'styled-components';

const Slider = styled.div`
  position: relative;
  width: 1000px;
  height: 5px;
  overflow-x: hidden;
`;

const Line = styled.div`
  opacity: 0.4;
  background: #4a8df8;
  width: 150%;
  height: 5px;
`;

const Subline = styled.div`
  position: absolute;
  background: #4a8df8;
  height: 5px;
`;

const Increase = keyframes`
 from { left: -5%; width: 5%; }
 to { left: 130%; width: 100%;}
`;

const Decrease = keyframes`
from { left: -80%; width: 80%; }
 to { left: 110%; width: 10%;}
`;

const SublineIncrease = styled(Subline)`
  animation: ${Increase} 2s infinite;
`;

const SublineDecrease = styled(Subline)`
  animation: ${Decrease} 2s 0.5s infinite;
`;

export const ProgressBar = () => {
  return (
    <Slider>
      <Line />
      <SublineIncrease />
      <SublineDecrease />
    </Slider>
  );
};
