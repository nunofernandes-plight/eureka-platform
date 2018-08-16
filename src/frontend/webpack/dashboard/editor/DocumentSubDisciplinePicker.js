import React from 'react';
import {flatten, uniq} from 'underscore';
import {Creatable} from 'react-select';
import getSubdisciplines from '../../../../helpers/SubDiscipline.js';
import TitleWithHelper from './TitleWithHelper';

const getOptions = (type, mainDisciplines, values) => {
  if (!mainDisciplines) {
    return [];
  }
  mainDisciplines = mainDisciplines.map(v => v.value);
  return flatten(
    mainDisciplines.map(main => {
      return getSubdisciplines(main);
    })
  ).map(d => Object({label: d, value: d}));
};

const DocumentSubDisciplinePicker = props => {
  return (
    <div>
      <TitleWithHelper
        field="main_discipline"
        requirement={props.requirement}
        document={props.document}
        title="Sub Discipline"
        id="main_discipline"
      />
      <Creatable
        onChange={value => {
          props.onChange(value);
        }}
        options={getOptions(
          props.document.type,
          props.mainDisciplines,
          props.value
        )}
        value={props.value}
        delimiter=","
        clearable={true}
        placeholder="Select sub disciplines..."
        isMulti
      />
    </div>
  );
};
export default DocumentSubDisciplinePicker;
