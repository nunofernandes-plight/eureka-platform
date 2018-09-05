import React from 'react';
import styled from 'styled-components';
import {InputField} from '../../design-components/Inputs.js';
import {__GRAY_100} from '../../../helpers/colors.js';
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
const AddressBookAddContact = props => {
  return (
    <Container>
      <Title>Add your contact to your Ethereum book!</Title>
      <SubTitle>
        Just insert a valid Ethereum Address, a first and last name! You can
        also add a customized label to your contact.
      </SubTitle>
      <InputField
        top={10}
        placeholder={'Ethereum Address'}
        status={props.address ? props.addressStatus : null}
        onChange={e => props.handleInput('address', e.target.value)}
      />
      <RowFlex>
        <InputField
          right={10}
          style={{flex: '1'}}
          placeholder={'First Name'}
          onChange={e => props.handleInput('firstName', e.target.value)}
        />
        <InputField
          style={{flex: '1'}}
          placeholder={'Last Name'}
          onChange={e => props.handleInput('lastName', e.target.value)}
        />
      </RowFlex>
      <RowFlex>
        <AddressBookLabelSelect />
      </RowFlex>
    </Container>
  );
};

export default AddressBookAddContact;
