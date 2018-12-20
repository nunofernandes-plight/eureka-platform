import React from 'react';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';
import {__ALERT_ERROR} from '../../../../helpers/colors.js';

const MyButton = styled.div`
  &:hover {
    transform: translateY(-2px);
  }
  font-size: 11px;
  cursor: pointer;
  transition: 0.3s all ease-in-out;
  background: ${props => props.background};
  font-style: normal;
  color: white;
  border-radius: 4px;
  padding: 4px 6px;
`;

const ActionButton = ({title, ...otherProps}) => {
  return (
    <div>
      <MyButton data-tip="" background={otherProps.background}>
        {otherProps.children}
      </MyButton>
      <ReactTooltip place="top" effect="solid">
        {title}
      </ReactTooltip>
    </div>
  );
};

export default ActionButton;
