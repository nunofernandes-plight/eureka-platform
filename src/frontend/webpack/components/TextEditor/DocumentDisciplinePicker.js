import React from 'react';
import Discipline from '../../../../models/Discipline.js';
import Select from '../Select.js';
import TitleWithHelper from './TitleWithHelper';

const mapOptions = o => {
  return {
    value: o.name,
    label: o.title
  };
};

const getOptions = type => {
  return Discipline.getForType(type).map(mapOptions);
};

const DocumentDisciplinePicker = props => {
  return (
    <div>
      <TitleWithHelper
        field="main_discipline"
        requirement={props.requirement}
        document={props.document}
        title="Main Discipline"
        id="main_discipline"
      />
      <Select
        onChange={value => {
          props.onChange(value);
        }}
        options={getOptions(props.type)}
        value={props.value}
        delimiter=","
        clearable={false}
        placeholder="Select main discipline..."
        isMulti
      />
    </div>
  );
};

export default DocumentDisciplinePicker;
