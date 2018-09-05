import React from 'react';
import styled from 'styled-components';
import {InputField} from '../../design-components/Inputs.js';
import {__ALERT_ERROR, __GRAY_100, __THIRD} from '../../../helpers/colors.js';
import AddressBookLabelSelect from './AddressBookLabelSelect.js';

const Container = styled.div`
  width: 600px;
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const Title = styled.h4`
  margin: 0;
  text-align: left;
  background: ${__GRAY_100};

  padding: 12px 0;
`;

const SubTitle = styled.p`
  text-align: left;
  margin-top: 0;
  font-size: 10px;
`;

const RowFlex = styled.div`
  display: flex;
  margin-top: 15px;
`;

const Label = styled.label`
  color: ${__THIRD};
  text-align: left;
  font-size: 12px;
  font-weight: bold;
`;

const LabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const AddressBookAddContact = props => {
  return (
    <Container>
      <Title>Add your contact to your Ethereum book!</Title>
      <SubTitle>
        Just insert a valid Ethereum Address, a first and last name! You can
        also add a customized label to your contact.
      </SubTitle>

      <Label>Ethereum Address</Label>
      <InputField
        placeholder={'0x94C5fE31Ec15A4e55679155de555e22903D7156b'}
        status={props.address ? props.addressStatus : null}
        onChange={e => props.handleInput('address', e.target.value)}
      />
      <RowFlex>
        <LabelContainer>
          <Label>First Name</Label>
          <InputField
            right={10}
            style={{flex: '1'}}
            placeholder={'Enter a first name..'}
            onChange={e => props.handleInput('firstName', e.target.value)}
          />
        </LabelContainer>
        <LabelContainer>
          <Label>Last Name</Label>
          <InputField
            style={{flex: '1'}}
            placeholder={'Enter a last name..'}
            onChange={e => props.handleInput('lastName', e.target.value)}
          />
        </LabelContainer>
      </RowFlex>
      <RowFlex>
        <LabelContainer>
          <Label>Select a contact Label</Label>
          <AddressBookLabelSelect
            onChangeLabel={label => props.onChangeLabel(label)}
          />
        </LabelContainer>
      </RowFlex>
    </Container>
  );
};

export default AddressBookAddContact;
