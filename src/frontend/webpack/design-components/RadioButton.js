import React from 'react';
import styled from 'styled-components';
import {__ALERT_ERROR, __THIRD} from '../../helpers/colors.js';

const Container = styled.div`
  position: relative;
`;

const Label = styled.label`
  &:before {
    transition: all 250ms cubic-bezier(0.4, 0.25, 0.3, 1);
    content: '';
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    border: 2px solid ${__THIRD};
    font-size: 0;
    position: absolute;
    -webkit-transform: translate(-50%, 50%);
    transform: translate(-50%, 50%);
    top: 50%;
    left: 50%;
    margin-top: 7px;
  }
  &:after {
    transition: all 250ms cubic-bezier(0.4, 0.25, 0.3, 1);
    content: '';
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    border: 2px solid ${__THIRD};
    font-size: 0;
    position: absolute;
    -webkit-transform: translate(-50%, 50%);
    transform: translate(-50%, 50%);
    top: 50%;
    margin-top: 7px;
    left: 50%;
  }
  font-size: 1rem;
  cursor: pointer;
  user-select: none;
  padding-left: 20px;
  padding-right: 20px;
`;

const Input = styled.input`
  display: none;
  &:checked + ${Label}:before {
    background-color: ${__THIRD};
    width: 20px;
    height: 20px;
    border-width: 2px;
    margin-top: 7px;
  }
  &:checked + ${Label}:after {
    background-color: transparent;
    width: 28px;
    height: 28px;
    margin-top: 7px;
    border-width: 2px;
    top: 13%;
    left: 50%;
  }
`;

const RadioButton = ({id, checked, ...otherProps}) => {
  return (
    <Container>
      <Input
        type="radio"
        name="radio1"
        id={id}
        value={id}
        checked={checked}
        onChange={e => {
          otherProps.onChange(e.target.value);
        }}
      />
      <Label htmlFor={id}>{otherProps.children}</Label>
    </Container>
  );
};

export default RadioButton;
