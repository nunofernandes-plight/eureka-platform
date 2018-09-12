import React from 'react';
import DocumentDisciplinePicker from './DocumentDisciplinePicker.js';
import DocumentSubDisciplinePicker from './DocumentSubDisciplinePicker.js';
import DocumentKeywordsPicker from './DocumentKeywordsPicker.js';
import ObservationTypePicker from './DocumentObservationTypePicker.js';
import Requirement from '../../../../models/Requirement.mjs';
import Document from '../../../../models/Document.mjs';

class DocumentPickers extends React.Component {
  requirementForField(field) {
    return (
      new Document(this.props.document).getTextRequirements()[field] ||
      new Requirement()
    );
  }
  render() {
    return (
      <div>
        <DocumentDisciplinePicker
          document={this.props.document}
          value={this.props.document.main_discipline}
          requirement={this.requirementForField('main_discipline')}
          onChange={main_discipline => {
            this.props.updateDocument({
              document: {
                ...this.props.document,
                main_discipline
              }
            });
            this.props.save();
          }}
          type={this.props.document.type}
        />
        <DocumentSubDisciplinePicker
          value={this.props.document.discipline}
          requirement={this.requirementForField('discipline')}
          document={this.props.document}
          mainDisciplines={this.props.document.main_discipline}
          onChange={discipline => {
            this.props.updateDocument({
              document: {
                ...this.props.document,
                discipline
              }
            });
            this.props.save();
          }}
        />
        <DocumentKeywordsPicker
          value={this.props.document.keywords}
          requirement={this.requirementForField('keywords')}
          document={this.props.document}
          onChange={keywords => {
            this.props.updateDocument({
              document: {
                ...this.props.document,
                keywords
              }
            });
            this.props.save();
          }}
        />
        {['replication'].includes(this.props.document.type) ? null : (
          <ObservationTypePicker
            value={this.props.document.link.observation_type}
            document={this.props.document}
            requirement={this.requirementForField('link.observation_type')}
            type={this.props.document.type}
            onChange={observation_type => {
              this.props.updateDocument({
                document: {
                  ...this.props.document,
                  link: {
                    ...this.props.document.link,
                    observation_type
                  }
                }
              });
              this.props.save();
            }}
          />
        )}
      </div>
    );
  }
}

export default DocumentPickers;
