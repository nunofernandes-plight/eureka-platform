import React from 'react';
import styled from 'styled-components';
import {__ALERT_ERROR, __ALERT_SUCCESS, __GRAY_200, __GRAY_300, __MAIN} from '../../../helpers/colors.js';
import Icon from '../../views/icons/Icon.js';
import {InputField} from '../../design-components/Inputs.js';

const Tr = styled.tr`
  &:hover {
    background: ${__GRAY_200};
  }
  transition: 0.5s all;
`;

const Td = styled.td`
  padding: 15px 0;
`;

const Tick = styled(Icon)`
  opacity: ${props => (props.valid ? '1' : '0.5')};
  pointer-events: ${props => (props.valid ? 'auto' : 'none')};
  background-color: ${props => (props.valid ? __ALERT_SUCCESS : __GRAY_300)};
`;

class AddressBookTableRow extends React.Component {
  constructor() {
    super();
    this.state = {
      contactAddress: null,
      firstName: null,
      lastName: null,
      comment: null
    };
  }

  validate() {
    return (
      this.state.firstName &&
      this.state.lastName
    );
  }

  handleInput(stateKey, e) {
    this.setState({[stateKey]: e.target.value});
  }

  componentDidMount() {
    this.setState({
      contactAddress: this.props.contact.contactAddress,
      firstName: this.props.contact.preName,
      lastName: this.props.contact.lastName,
      comment: this.props.contact.info
    })
  }

  render() {
    if (this.props.editable)
      return (
        <Tr key={this.state.contactAddress}>
          <Td
            width={'42%'}>
            {this.state.contactAddress}
          </Td>
          <td
            width={'16%'}>
            <InputField
              value={this.state.firstName}
              placeholder={'First Name'}
              onChange={e => this.handleInput('firstName', e)}
            />
          </td>
          <td
            width={'16%'}>
            <InputField
              value={this.state.lastName}
              placeholder={'Last Name'}
              onChange={e => this.handleInput('lastName', e)}
            />
          </td>
          <td
            width={'26%'}>
            <InputField
              value={this.state.comment}
              placeholder={'Comment'}
              onChange={e => this.handleInput('comment', e)}
            />
          </td>
          <td>
            <Tick
              valid={this.validate()}
              icon={'check'}
              width={20}
              height={20}
              color={__ALERT_SUCCESS}
              onClick={() => {
                this.props.onSave(this.state.contactAddress, this.state.firstName, this.state.lastName, this.state.comment);
              }}
            />
          </td>
          <td>
            <Icon
              icon={'delete'}
              width={20}
              height={20}
              color={__ALERT_ERROR}
              onClick={() => {
                this.props.onDelete(this.props.contact.contactAddress);
              }}
            />
          </td>
        </Tr>
      );
    else
      return (
        <Tr key={this.state.contactAddress}>
          <Td
            width={'42%'}>
            {this.state.contactAddress}
          </Td>
          <td
            width={'16%'}>
            {this.state.firstName}
          </td>
          <td
            width={'16%'}>
            {this.state.lastName}
          </td>
          <td
            width={'26%'}>
            {this.state.comment}
          </td>
          <td>
            <Icon
              valid={this.validate()}
              icon={'edit'}
              width={20}
              height={20}
              color={__MAIN}
              onClick={() => {
                this.props.onEdit(this.state.contactAddress);
              }}
            />
          </td>
          <td>
            <Icon
              icon={'delete'}
              width={20}
              height={20}
              color={__ALERT_ERROR}
              onClick={() => {
                this.props.onDelete(this.state.contactAddress);
              }}
            />
          </td>
        </Tr>
      );
  };
}

export default AddressBookTableRow;
