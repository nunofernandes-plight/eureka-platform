import React from 'react';
import chroma from 'chroma-js';
import Select from 'react-select';
import {ContactLabels} from './ContactLabels.js';

const colourStyles = {
  control: styles => ({
    ...styles,
    backgroundColor: 'white',
    width: 600
  }),
  option: (styles, {data, isDisabled, isFocused, isSelected}) => {
    const color = chroma(data.color);
    return {
      ...styles,
      backgroundColor: isDisabled
        ? null
        : isSelected ? data.color : isFocused ? color.alpha(0.1).css() : null,
      color: isDisabled
        ? '#ccc'
        : isSelected
          ? chroma.contrast(color, 'white') > 2 ? 'white' : 'black'
          : data.color,
      cursor: isDisabled ? 'not-allowed' : 'default'
    };
  },
  multiValue: (styles, {data}) => {
    const color = chroma(data.color);
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css()
    };
  },
  multiValueLabel: (styles, {data}) => ({
    ...styles,
    color: data.color
  }),
  multiValueRemove: (styles, {data}) => ({
    ...styles,
    color: data.color,
    ':hover': {
      backgroundColor: data.color,
      color: 'white'
    }
  })
};

export default (props) => (
  <Select
    closeMenuOnSelect={false}
    isMulti
    options={ContactLabels}
    styles={colourStyles}
    onChange={value => props.onChangeLabel(value)}
    value={props.value}
  />
);
