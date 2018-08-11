import React from 'react';
import styled from 'styled-components';
import './circle.css';

const Spinner = styled.div``;

const CircleSpinner = () => {
  return <Spinner className="lds-hourglass" />;
};

export default CircleSpinner;
