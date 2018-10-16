import React from 'react';
import styled from 'styled-components';
import {InputField} from '../../design-components/Inputs.js';
import ToggleButton from '../../design-components/ToggleButton.js';
const QuerySection = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 25px;
  align-items: center;
  width: 75%;
  position: relative;
`;

const MyLabel = styled.label`
  font-size: 10px;
  font-weight: bold;
  text-align: center;
`;
const AddFilters = styled.div`
  display: flex;
  margin-left: 15px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 70px;
`;

const EditorQuerySection = props => {
  return (
    <QuerySection>
      <InputField
        width={'100%'}
        placeholder={'Search an article..'}
        onChange={e => {
          props.handleQuery('query', e.target.value);
        }}
      />
      <AddFilters>
        <MyLabel>Active filters</MyLabel>
        <ToggleButton
          checked={props.checked}
          onChange={filtersActive => {
            props.handleFilters(filtersActive);
          }}
        />
      </AddFilters>
    </QuerySection>
  );
};

export default EditorQuerySection;
