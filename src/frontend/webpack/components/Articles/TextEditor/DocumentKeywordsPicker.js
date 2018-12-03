import React, {Component} from 'react';
import {Creatable} from 'react-select';
import TitleWithHelper from './TitleWithHelper';

const getOptions = custom => {
  return custom.map(c => ({
    label: c.label,
    value: c.value
  }));
};

class DocumentKeywordsPicker extends Component {
  render() {
    return (
      <div>
        <TitleWithHelper
          field="keywords"
          requirement={this.props.requirement}
          document={this.props.document}
          title="Keywords"
          id="keywords"
        />
        <Creatable
          onChange={value => {
            this.props.onChange(value);
          }}
          options={getOptions(this.props.value)}
          value={this.props.value}
          delimiter=","
          clearable={true}
          placeholder="Enter keywords or type your own..."
          isMulti
        />
      </div>
    );
  }
}

export default DocumentKeywordsPicker;
