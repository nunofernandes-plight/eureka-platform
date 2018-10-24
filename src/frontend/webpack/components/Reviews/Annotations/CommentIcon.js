import React from 'react';
import styled from 'styled-components';
import Icon from '../../../views/icons/Icon.js';
import {__GRAY_400, __GRAY_800} from '../../../../helpers/colors.js';

const Circle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  border-radius: 50%;
  opacity: ${props => (props.show ? 1 : 0)};
  visibility: ${props => (props.show ? 'visible' : 'hidden')};
  transition: 0.3s ease-in-out;
`;

const IconContainer = styled.div`
  &:hover {
    color: ${__GRAY_800};
  }
  color: ${__GRAY_400};
  cursor: pointer;
  width: 42px;
  padding: 5px;
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CommentIcon = props => {
  return (
    <Circle {...props}>
      <IconContainer>
        <Icon
          icon={'material'}
          material={'add_comment'}
          width={22}
          height={22}
          noMove
        />
      </IconContainer>
    </Circle>
  );
};
