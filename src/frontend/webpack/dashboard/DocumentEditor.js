import Editor from 'draft-js-plugins-editor';
import createSingleLinePlugin from 'draft-js-single-line-plugin';
import React, {Component} from 'react';
import styled from 'styled-components';
import {TopContainer} from './TopContainer.js';
import {getDomain} from '../../../helpers/getDomain.js';
import GridSpinner from '../../webpack/spinners/GridSpinner.js';
import Toolbar from './editor/Toolbar.js';
import {__GRAY_500} from '../../helpers/colors.js';
import {customStyleMap} from './editor/customStyleMap.js';
import './editor/new-article.css';
import 'draft-js/dist/Draft.css';
import TitleWithHelper from './editor/TitleWithHelper.js';
import Document from '../../../models/Document.mjs';
import {
  deserializeDocument,
  serializeSavePatch
} from '../../../helpers/documentSerializer.mjs';
import getChangedFields from '../../../helpers/compareDocuments.js';
import {pick} from 'underscore';
import DocumentDisciplinePicker from './editor/DocumentDisciplinePicker.js';
import Requirement from '../../../models/Requirement.mjs';
import DocumentSubDisciplinePicker from './editor/DocumentSubDisciplinePicker.js';
import DocumentKeywordsPicker from './editor/DocumentKeywordsPicker.js';

const titleStyle = () => 'title';

const Parent = styled.div`
  display: flex;
  flex-direction: column;
  font-family: 'Roboto', sans-serif;
`;
const Container = styled.div`
  transition: all 0.5s;
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0 20px;
`;
const EditorCard = styled.div`
  display: flex;
  flex-direction: column;
  word-wrap: break-word;
  border: 0.0625rem solid rgba(0, 0, 0, 0.05);
  border-radius: 0.25rem;
  background-color: #ffffff;
  background-clip: border-box;
  min-height: 420px;
  width: 1070px;
  box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07) !important;
  margin-top: -130px !important;
  padding: 40px 80px;
`;

const Title = styled.h2`
  text-align: center;
  color: ${__GRAY_500};
`;

const EditorContent = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 100%;
`;

const Line = styled.div`
  margin: 15px 0;
`;

const TitleContainer = styled.div`
  color: inherit;
`;
const ButtonContainer = styled.div`
  align-self: center;
`;
const Button = styled.button``;

const Authors = styled.div``;
class DocumentEditor extends Component {
  constructor() {
    super();
    this.state = {
      errorMessage: null,
      loading: false,
      document: null
    };
    //
    // this.onChange = editorState => {
    //   const field = editorState.getCurrentContent();
    //   const raw = convertToRaw(field);
    //
    //   // console.log(raw.blocks[0].text);
    //   // let html = stateToHTML(title);
    //   // console.log(html);
    //   this.setState({editorState});
    // };
  }

  componentDidMount() {
    this.setState({loading: true});
    const draftId = this.props.match.params.id;
    fetch(`${getDomain()}/api/articles/drafts/${draftId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          let document = new Document(response.data.document);
          let deserialized = deserializeDocument(document);
          this.setState({
            document: deserialized,
            lastSavedVersion: deserialized
          });
        } else {
          this.setState({
            errorMessage: response.error
          });
        }
        this.setState({loading: false});
      })
      .catch(err => {
        console.log(err);
        this.setState({
          errorMessage: 'Ouh. Something went wrong.',
          loading: false
        });
      });

    this.saveInterval = setInterval(() => {
      this.save();
    }, 5000);
  }

  componentWillUnmount() {
    if (this.saveInterval) {
      clearInterval(this.saveInterval);
    }
  }

  onTitleChange = title => {
    this.updateDocument({
      document: {
        ...this.state.document,
        title
      }
    });
  };

  updateDocument({
    document,
    otherStatesToSet = {},
    modifications = true,
    citationsToRemove = []
  }) {
    this.setState({
      document,
      ...otherStatesToSet
    });
  }

  getModifiedFields() {
    if (!this.state.lastSavedVersion) {
      return [];
    }
    return getChangedFields(this.state.lastSavedVersion, this.state.document);
  }

  save() {
    const changedFields = this.getModifiedFields();
    const toSave = new Document(this.state.document);
    const patch = pick(toSave, ...changedFields);
    const draftId = this.props.match.params.id;

    fetch(`${getDomain()}/api/articles/drafts/${draftId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        document: serializeSavePatch(patch)
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          // this.setState({document: response.data.document});
          // // let document = new Document(response.data.document);
          // // let deserialized = deserializeDocument(document);
          // this.setState({
          //   document: deserialized
          // });
        } else {
          this.setState({
            errorMessage: response.error
          });
        }
        this.setState({loading: false});
      })
      .catch(err => {
        console.log(err);
        this.setState({
          errorMessage: 'Ouh. Something went wrong.',
          loading: false
        });
      });
  }

  renderTitle() {
    const singleLinePlugin = createSingleLinePlugin();
    return (
      <TitleContainer className="title">
        <TitleWithHelper
          field="title"
          requirement={{required: true, hint: 'this is a test rqureiaijsfijas'}}
          document={{title: 'test'}}
          title="Title"
          id="title"
        />
        <Editor
          plugins={[singleLinePlugin]}
          editorState={this.state.document.title}
          onChange={this.onTitleChange.bind(this)}
          blockStyleFn={titleStyle}
          blockRenderMap={singleLinePlugin.blockRenderMap}
          placeholder="Please enter your title..."
          customStyleMap={customStyleMap}
        />
      </TitleContainer>
    );
  }

  renderAuthors() {
    return (
      <div>
        {' '}
        <TitleWithHelper
          field="authors"
          requirement={{required: true, hint: 'this is a test rqureiaijsfijas'}}
          document={{title: 'test'}}
          title="Authors"
          id="authors"
        />
        <Authors>{this.state.document.authors}</Authors>
      </div>
    );
  }

  requirementForField(field) {
    return (
      new Document(this.state.document).getTextRequirements()[field] ||
      new Requirement()
    );
  }

  renderMainDiscipline() {
    return (
      <div>
        <DocumentDisciplinePicker
          document={this.state.document}
          value={this.state.document.main_discipline}
          requirement={this.requirementForField('main_discipline')}
          onChange={main_discipline => {
            this.updateDocument({
              document: {
                ...this.state.document,
                main_discipline
              }
            });
          }}
          type={this.state.document.type}
        />
        <DocumentSubDisciplinePicker
          value={this.state.document.discipline}
          requirement={this.requirementForField('discipline')}
          document={this.state.document}
          mainDisciplines={this.state.document.main_discipline}
          onChange={discipline => {
            console.log(discipline);
            this.updateDocument({
              document: {
                ...this.state.document,
                discipline
              }
            });
          }}
        />
        <DocumentKeywordsPicker
          value={this.state.document.keywords}
          requirement={this.requirementForField('keywords')}
          document={this.state.document}
          onChange={keywords => {
            this.updateDocument({
              document: {
                ...this.state.document,
                keywords
              }
            });
          }}
        />
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.state.loading || !this.state.document ? (
          <GridSpinner />
        ) : (
          <Parent>
            <TopContainer />
            <Container>
              <EditorCard>
                <Title>Write your article</Title>
                <Toolbar />
                <EditorContent>
                  <Line>{this.renderTitle()}</Line>
                  <Line>{this.renderAuthors()}</Line>
                  <Line>{this.renderMainDiscipline()}</Line>
                </EditorContent>
                <ButtonContainer>
                  <Button>Submit Article</Button>
                </ButtonContainer>
              </EditorCard>
            </Container>
          </Parent>
        )}
      </div>
    );
  }
}

export default DocumentEditor;
