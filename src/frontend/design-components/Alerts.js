import React from 'react';
import styled from 'styled-components';
import {
  __ALERT_DANGER,
  __ALERT_ERROR,
  __ALERT_INFO,
  __ALERT_SUCCESS,
  __ALERT_WARNING
} from '../helpers/colors.js';
import Icon from '../webpack/icons/Icon.js';

const getColor = props => {
  if (props.status === 'success') {
    return `${__ALERT_SUCCESS}`;
  } else if (props.status === 'info') {
    return `${__ALERT_INFO}`;
  } else if (props.status === 'warning') {
    return `${__ALERT_WARNING}`;
  } else if (props.status === 'danger') {
    return `${__ALERT_DANGER}`;
  } else if (props.status === 'error') {
    return `${__ALERT_ERROR}`;
  }
};

const getIcon = props => {
  if (props.status === 'success') {
    return <Icon icon={'thumbs-up'} width={20} height={20} right={5} />;
  } else if (props.status === 'info') {
    return <Icon icon={'bell'} width={20} height={20} right={5} />;
  } else if (props.status === 'warning') {
    return <Icon icon={'bell'} width={20} height={20} right={5} />;
  } else if (props.status === 'danger') {
    return <Icon icon={'bell'} width={20} height={20} right={5} />;
  } else if (props.status === 'error') {
    return <Icon icon={'exlamation-circle'} width={20} height={20} right={5} />;
  }
};

const Label = styled.div`
  margin: 0 4px;
  font-weight: bold;
`;

const getLabel = props => {
  if (props.status === 'success') {
    return <Label>Success: </Label>;
  } else if (props.status === 'info') {
    return <Label>Info: </Label>;
  } else if (props.status === 'warning') {
    return <Label>Warning: </Label>;
  } else if (props.status === 'danger') {
    return <Label>Danger: </Label>;
  } else if (props.status === 'error') {
    return <Label>Error: </Label>;
  }
};

const Container = styled.div`
  color: #fff;
  border-color: ${props => getColor(props)};
  background-color: ${props => getColor(props)};
  font-size: 0.875rem;
  padding: 1rem 1.5rem;
  border: 0;
  display: flex;
  border-radius: 0.25rem;
`;
export const Alert = props => {
  return (
    <Container {...props}>
      {getIcon(props)} {getLabel(props)} This is a text message for testing the
      alerts!! Check it our pleaese
    </Container>
  );
};
