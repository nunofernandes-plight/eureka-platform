import React, {Component} from 'react';
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
  const marginRight = 20;
  const iconSize = 25;
  if (props.status === 'success') {
    return (
      <Icon
        icon={'thumbs-up'}
        width={iconSize}
        height={iconSize}
        right={marginRight}
      />
    );
  } else if (props.status === 'info') {
    return (
      <Icon
        icon={'bell'}
        width={iconSize}
        height={iconSize}
        right={marginRight}
      />
    );
  } else if (props.status === 'warning') {
    return (
      <Icon
        icon={'bell'}
        width={iconSize}
        height={iconSize}
        right={marginRight}
      />
    );
  } else if (props.status === 'danger') {
    return (
      <Icon
        icon={'bell'}
        width={iconSize}
        height={iconSize}
        right={marginRight}
      />
    );
  } else if (props.status === 'error') {
    return (
      <Icon
        icon={'exlamation-circle'}
        width={iconSize}
        height={iconSize}
        right={marginRight}
      />
    );
  }
};
const Container = styled.div`
  color: #fff;
  border-color: ${props => getColor(props)};
  background-color: ${props => getColor(props)};
  font-size: 0.875rem;
  padding: 1rem 1.5rem;
  border: 0;
  border-radius: 0.25rem;
  transition: 0.5s ease-in-out;
  display: ${props => (props.isHidden ? 'none' : 'flex')};
`;

class Alert extends Component {
  constructor() {
    super();
    this.state = {
      isHidden: false
    };
  }

  hideAlert() {
    this.setState({isHidden: true});
  }

  render() {
    return (
      <div>
        <Container isHidden={this.state.isHidden} {...this.props}>
          {getIcon(this.props)} {this.props.children}
          <Icon
            onClick={() => this.hideAlert()}
            icon={'close'}
            width={18}
            height={18}
            top={2}
          />
        </Container>
      </div>
    );
  }
}

export default Alert;
