import React from 'react';
import styled from 'styled-components';
import {
  __ALERT_ERROR,
  __ALERT_SUCCESS,
  __GRAY_200,
  __THIRD
} from '../helpers/colors.js';
import Icon from '../webpack/icons/Icon.js';

const getColor = (props, placeholder) => {
  if (props.status === 'valid') {
    return `${__ALERT_SUCCESS}`;
  } else if (props.status === 'error') {
    return `${__ALERT_ERROR}`;
  } else {
    if (placeholder) {
      return `${__THIRD}`;
    } else {
      return `${__GRAY_200}`;
    }
  }
};
const Status = styled.div`
  line-height: 22px;
  position: absolute;
  right: 15px;
  margin-top: 8px;
`;

const IconContainer = styled.div`
  background: ${props => (props.status ? getColor(props) : null)};
  padding: 3px 9px;
  border-radius: 50%;
`;

const Container = styled.div`
  display: flex;
`;

const renderIcon = props => {
  if (props.status === 'valid') {
    return <Icon icon={'check'} width={10} heigth={10} />;
  } else if (props.status === 'error') {
    return <Icon icon={'exlamation'} width={10} height={16} bottom={2} />;
  }
};
export const InputField = props => {
  return (
    <Container>
      <Input
        id={props.id ? props.id : null}
        type={props.type ? props.type : null}
        {...props}
      />
      <Status {...props}>
        <IconContainer {...props}>{renderIcon(props)}</IconContainer>
      </Status>
    </Container>
  );
};

export const Input = styled.input`
  &:focus {
    box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  }
  ::-webkit-input-placeholder {
    /* Chrome/Opera/Safari */
    color: ${props => getColor(props, 'placeholder')};
  }
  ::-moz-placeholder {
    /* Firefox 19+ */
    color: ${props => getColor(props, 'placeholder')};
  }
  :-ms-input-placeholder {
    /* IE 10+ */
    color: ${props => getColor(props, 'placeholder')};
  }
  :-moz-placeholder {
    /* Firefox 18- */
    color: ${props => getColor(props, 'placeholder')};
  }
  line-height: 1.5;
  display: block;
  width: 100%;
  height: calc(2.75rem + 2px);
  padding: 0.625rem 0.75rem;
  border-radius: 0.25rem;
  background-color: #fff;
  background-clip: padding-box;
  transition: box-shadow 0.15s ease;
  box-shadow: 0 1px 3px rgba(50, 50, 93, 0.15), 0 1px 0 rgba(0, 0, 0, 0.02);
  color: ${__THIRD};
  border-color: ${props => getColor(props)};
  border: 1px solid ${props => getColor(props)};
  position: relative;
`;
