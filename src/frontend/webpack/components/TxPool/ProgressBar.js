import React from 'react';
import styled, {keyframes} from 'styled-components';
import {__FIFTH} from '../../../helpers/colors.js';

const Parent = styled.div`
  width: 100%;
  margin-top: -3px;
`;
const Slider = styled.div`
  width: 100%;
  height: ${props => props.height}px;
  position: absolute;
  overflow-x: hidden;
`;

const Line = styled.div`
  opacity: ${props => (props.static ? '1' : '0.4')};
  background: ${__FIFTH};
  width: 150%;
  height: ${props => props.height}px;
  position: absolute;
`;

const Subline = styled.div`
  position: absolute;
  background: ${__FIFTH};
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
  height: ${props => props.height}px;
`;

const SublineDecrease = styled(Subline)`
  animation: ${Decrease} 2s 0.5s infinite;
  height: ${props => props.height}px;
`;

export const ProgressBar = ({height, ...otherProps}) => {
  return (
    <Parent>
      <Slider height={height}>
        <Line height={height} static={otherProps.static} />
        <SublineIncrease height={height} />
        <SublineDecrease height={height} />
      </Slider>
    </Parent>
  );
};
