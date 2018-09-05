import React from 'react';
import styled from 'styled-components';
import {Card} from '../../views/Card.js';
import {__FIFTH} from '../../../helpers/colors.js';
import Icon from '../../views/icons/Icon.js';
import Modal from '../../design-components/Modal.js';
import {
  createContact,
  deleteContact,
  getContacts,
  updateContact
} from './AddressBookMethods.js';
import CircleSpinner from '../../views/spinners/CircleSpinner.js';
import AddressBookTable from './AddressBookTable.js';
import AddressBookAddContact from './AddressBookAddContact';

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const AddContact = styled.div`
  display: flex;
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
  border-radius: 50%;
  padding: 0.4rem;
  transition: 0.3s all;
  color: #fff;
  background-color: ${__FIFTH};
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
`;

class AddressBook extends React.Component {
  constructor() {
    super();
    this.state = {
      contacts: [],
      address: null,
      firstName: null,
      lastName: null,
      label: null,

      fetchingContactsLoading: false,
      contactToEdit: null,

      showAddContactModal: false,
      showDeleteModal: false,
      contactToDelete: null,

      showErrorModal: false,
      errorMessage: null
    };
  }

  isInputValid() {
    return (
      this.props.web3.utils.isAddress(this.state.address) &&
      this.state.firstName &&
      this.state.lastName
    );
  }

  handleInput(stateKey, value) {
    this.computeInputStatus(stateKey, value);
    this.setState({[stateKey]: value});
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
        <Modal
          action={'ADD CONTACT'}
          callback={async () => {
            this.setState({submitted: true});
            if (this.isInputValid()) {
              this.setState({showAddContactModal: false});
              this.addContact();
              this.setState({submitted: false});
            }
          }}
          show={this.state.showAddContactModal}
          toggle={showAddContactModal => {
            this.setState({showAddContactModal});
          }}
          title={'Add a new contact'}
        >
          <AddressBookAddContact
            web3={this.props.web3}
            submitted={this.state.submitted}
            firstName={this.state.firstName}
            lastName={this.state.lastName}
            address={this.state.address}
            onChangeLabel={label => {
              this.handleInput('label', label);
            }}
            handleInput={(field, value) => {
              this.handleInput(field, value);
            }}
          />
        </Modal>
      </div>
    );
  }

  addContact() {
    createContact(
      this.state.address,
      this.state.firstName,
      this.state.lastName,
      this.state.label
    )
      .then(response => {
        if (response.status === 200) {
          this.fetchContacts();
          this.setState({
            address: null,
            firstName: null,
            lastName: null,
            label: null
          });
        } else if (response.status === 409)
          this.setState({
            errorMessage:
              'There exists already a contact with the same address.'
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

  saveContact(contactAddress) {
    const contact = this.state.contacts.find(c => {
      return contactAddress === c.contactAddress;
    });

    updateContact(contact)
      .then(async response => {
        if (response.status === 200) {
          await this.fetchContacts();
        } else
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
        } else
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
            <Circle onClick={() => this.setState({showAddContactModal: true})}>
              <Icon icon={'material'} material={'add'} width={25} noMove />
            </Circle>
          </AddContact>
          {this.state.contacts ? (
            <AddressBookTable
              contacts={this.state.contacts}
              onEdit={address => {
                const contacts = [...this.state.contacts];
                contacts.map(c => {
                  if (c.contactAddress === address) {
                    c.onEdit = true;
                    return c;
                  }
                });
                this.setState({contacts});
              }}
              onChange={(field, address, value) => {
                const newContacts = this.state.contacts.map(contact => {
                  if (contact.contactAddress !== address) return contact;
                  return {...contact, [field]: value};
                });
                this.setState({contacts: newContacts});
              }}
              onSave={address => this.saveContact(address)}
              // onDelete={contactAddress => {
              //   this.setState({
              //     showDeleteModal: true,
              //     contactToDelete: contactAddress
              //   });
              // }}
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
