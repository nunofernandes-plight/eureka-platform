import React from 'react';
import styled from 'styled-components';
import {Card} from '../../views/Card.js';
import {InputField} from '../../design-components/Inputs.js';
import {__FIFTH, __GRAY_300, __THIRD} from '../../../helpers/colors.js';
import Icon from '../../views/icons/Icon.js';
import Modal from '../../design-components/Modal.js';
import {createContact, deleteContact, getContacts, updateContact} from './AddressBookMethods.js';
import CircleSpinner from '../../views/spinners/CircleSpinner.js';
import AddressBookTable from './AddressBookTable.js';

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const AddContact = styled.div`
  display: flex;
  margin: 50px 20px 0;
  position: relative;
  width: 100%;
  justify-content: space-around;
  align-items: center;
`;

const Circle = styled.div`
  &:hover {
    transform: translateY(3px);
    cursor: pointer;
  }
  opacity: ${props => (props.valid ? '1' : '0.5')};
  pointer-events: ${props => (props.valid ? 'auto' : 'none')};
  background-color: ${props => (props.valid ? __THIRD : __GRAY_300)};
  border-radius: 50%;
  padding: 0.4rem;
  transition: 0.3s all;
  color: #fff;
  background-color: ${__FIFTH};
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
`;

const CustomInputField = styled(InputField)`
  padding: 0 5px;
`;

class AddressBook extends React.Component {
  constructor() {
    super();
    this.state = {
      contacts: [],
      address: null,
      firstName: null,
      lastName: null,
      comment: null,

      fetchingContactsLoading: false,
      contactToEdit: null,

      showDeleteModal: false,
      contactToDelete: null,

      showErrorModal: false,
      errorMessage: null
    };
  }

  validate() {
    return (
      this.props.web3.utils.isAddress(this.state.address) &&
      this.state.firstName &&
      this.state.lastName
    );
  }

  handleInput(stateKey, e) {
    if (stateKey === 'address') {
      if (this.props.web3.utils.isAddress(e.target.value)) {
        this.setState({addressStatus: 'valid'});
      } else {
        this.setState({addressStatus: 'error'});
      }
    }
    this.setState({[stateKey]: e.target.value});
  }

  renderModals() {
    return (
      <div>
        <Modal
          type={'notification'}
          toggle={() => {
            this.setState({errorMessage: null});
          }}
          show={this.state.errorMessage}
          title={'You got the following error'}
        >
          {this.state.errorMessage}
        </Modal>
        <Modal
          action={'DELETE'}
          type={'notification'}
          callback={() => {
            this.setState({showDeleteModal: false});
            this.removeContact();
          }}
          toggle={showDeleteModal => {
            this.setState({showDeleteModal});
          }}
          show={this.state.showDeleteModal}
          title={'Delete Contact'}
        >
          Are you sure you want to delete this contact? This action will be
          permanent.
        </Modal>
      </div>
    );
  }

  addContact() {
    createContact(this.state.address, this.state.firstName, this.state.lastName, this.state.comment)
      .then(response => {
        if (response.status === 200) {
          this.fetchContacts();
          this.setState({
            address: null,
            firstName: null,
            lastName: null,
            comment: null
          });
        }
        else if (response.status === 409)
          this.setState({
            errorMessage: 'There exists already a contact with the same address.'
          });
        else
          this.setState({
            errorMessage: 'Ouh. Something went wrong.'
          });
      })
      .catch(err => {
        this.setState({
          errorMessage: 'Ouh. Something went wrong.'
        });
      });
  }

  editContact(contactAddress, firstName, lastName, info) {
    updateContact(contactAddress, firstName, lastName, info)
      .then(response => {
        if (response.status === 200) {
          this.setState({contactToEdit: null});
          this.fetchContacts();
        }
        else
          this.setState({
            errorMessage: 'Ouh. Something went wrong.'
          });
      })
      .catch(err => {
        this.setState({
          errorMessage: 'Ouh. Something went wrong.'
        });
      });
  }

  removeContact() {
    deleteContact(this.state.contactToDelete)
      .then(response => {
      if (response.status === 200) {
        this.setState({
          showDeleteModal: false,
          contactToDelete: null
        });
        this.fetchContacts();
      }
      else
        this.setState({
          errorMessage: 'Ouh. Something went wrong.'
        });
    })
      .catch(err => {
        this.setState({
          errorMessage: 'Ouh. Something went wrong.'
        });
      });
  }

  fetchContacts() {
    getContacts()
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          this.setState({contacts: response.data});
        } else {
          this.setState({
            errorMessage: response.error,
            fetchingContactsLoading: false
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          errorMessage: 'Ouh. Something went wrong.',
          fetchingContactsLoading: false
        });
      });
  }

  componentDidMount() {
    this.fetchContacts();
  }

  render() {
    return (
      <Container>
        {this.renderModals()}
        <Card width={1000} title={'My Ethereum Address Book'}>
          <AddContact>

            <CustomInputField
              width={'42%'}
              placeholder={'Ethereum Address'}
              status={this.state.address ? this.state.addressStatus : null}
              onChange={e => this.handleInput('address', e)}
            />

            <CustomInputField
              width={'16%'}
              placeholder={'First Name'}
              onChange={e => this.handleInput('firstName', e)}
            />

            <CustomInputField
              width={'16%'}
              placeholder={'Last Name'}
              onChange={e => this.handleInput('lastName', e)}
            />

            <CustomInputField
              width={'26%'}
              placeholder={'Comment'}
              onChange={e => this.handleInput('comment', e)}
            />

            <Circle
              valid={this.validate()}
              onClick={() => this.addContact()}
            >
              <Icon icon={'material'} material={'add'} width={25} noMove />
            </Circle>
          </AddContact>
          {this.state.contacts ? (
            <AddressBookTable
              contacts={this.state.contacts}
              contactToEdit={this.state.contactToEdit}
              onEdit={contactAddress => this.setState({contactToEdit: contactAddress})}
              onSave={(contactAddress, firstName, lastName, info) => this.editContact(contactAddress, firstName, lastName, info)}
              onDelete={contactAddress => {
                this.setState({
                  showDeleteModal: true,
                  contactToDelete: contactAddress
                });
              }}
            />
          ) : (
            <div style={{marginTop: 25}}>
              <CircleSpinner />
            </div>
          )}
        </Card>
      </Container>
    );
  }
}
export default AddressBook;
