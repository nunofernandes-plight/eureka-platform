import React from 'react';
import ObservationTypeModel from '../../../../models/ObservationType.js';
import Select from '../Select';
import TitleWithHelper from './TitleWithHelper';
import DropdownDetailOption from './DropdownDetailOption';

const getLabel = type => {
  if (type === 'hypothesis') {
    return 'Hypothesis type';
  }
  return 'Observation type';
};

const DocumentObservationTypePicker = props => {
  return (
    <div>
      <TitleWithHelper
        field="link.observation_type"
        document={props.document}
        requirement={props.requirement}
        title={getLabel(props.type)}
        id="link.observation_type"
      />
      <Select
        onChange={value => props.onChange(value)}
        value={props.value}
        clearable={false}
        searchable={false}
        placeholder="Choose between Standalone and Followup..."
        optionRenderer={option => {
          return (
            <DropdownDetailOption title={option.label} subtitle={option.hint} />
          );
        }}
        options={ObservationTypeModel.all.map(o => {
          return Object({value: o.name, label: o.title, hint: o.hint});
        })}
      />
    </div>
  );
};

export default DocumentObservationTypePicker;
