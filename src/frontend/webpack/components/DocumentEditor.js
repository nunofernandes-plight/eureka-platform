import Editor from 'draft-js-plugins-editor';
import createSingleLinePlugin from 'draft-js-single-line-plugin';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import styled from 'styled-components';
import sha256 from 'js-sha256';
import {getDomain} from '../../../helpers/getDomain.js';
import GridSpinner from '../views/spinners/GridSpinner.js';
import Toolbar from './editor/Toolbar.js';
import {__GRAY_500, __GRAY_600} from '../../helpers/colors.js';
import {customStyleMap} from '../../helpers/customStyleMap.js';
import './editor/new-article.css';
import 'draft-js/dist/Draft.css';
import TitleWithHelper from './editor/TitleWithHelper.js';
import Document from '../../../models/Document.mjs';
import {
  deserializeDocument,
  serializeSavePatch
} from '../../../helpers/documentSerializer.mjs';
import getChangedFields from '../../../helpers/compareDocuments.js';
import {pick, debounce} from 'underscore';
import DocumentDisciplinePicker from './editor/DocumentDisciplinePicker.js';
import Requirement from '../../../models/Requirement.mjs';
import DocumentSubDisciplinePicker from './editor/DocumentSubDisciplinePicker.js';
import DocumentKeywordsPicker from './editor/DocumentKeywordsPicker.js';
import ObservationTypePicker from './editor/DocumentObservationTypePicker.js';
import Icon from '../views/icons/Icon.js';
import Modal from '../../webpack/design-components/Modal.js';
import {fromS3toCdn} from '../../../helpers/S3UrlConverter.js';
import DropZoneHandler from './editor/DropZoneHandler.js';
import DocumentFiguresRenderer from './editor/DocumentFiguresRenderer.js';
import SmartContractInputData from '../views/SmartContractInputData.js';
import {getArticleHex} from '../../web3/Helpers.js';
import {SUBMISSION_PRICE} from '../constants/Constants.js';
import {submitArticle} from '../../../backend/web3/web3-token-contract-methods.mjs';
const titleStyle = () => 'title';

const Parent = styled.div`
  display: flex;
  flex-direction: column;
  font-family: 'Roboto', sans-serif;
`;

const EditorParent = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;
const Container = styled.div`
  transition: all 0.5s;
  display: flex;
  justify-content: center;
  position: relative;
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
  padding: 40px 80px;
  margin-top: 20px !important;
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

const LeftTopContainer = styled.div`
  padding: 15px;
  border: 0.0625rem solid rgba(0, 0, 0, 0.05);
  border-radius: 0.25rem;
  box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07) !important;
  background-color: #ffffff;
  margin-right: 20px;
  height: 100%;
  margin-top: 21px;
`;

const RightTopContainer = styled.div`
  padding: 15px 10px;
  border: 0.0625rem solid rgba(0, 0, 0, 0.05);
  border-radius: 0.25rem;
  box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07) !important;
  background-color: #ffffff;
  margin-bottom: 20px;
  align-self: flex-end;
  width: 200px;

  position: absolute;
  top: -60px;
`;

const SaveChanges = styled.div`
  color: ${__GRAY_600};
  display: flex;
  justify-content: center;
`;

const FiguresFlex = styled.div`
  display: flex;
  align-items: center;
`;

class DocumentEditor extends Component {
  constructor() {
    super();
    this.state = {
      errorMessage: null,
      loading: false,
      lastSavedVersion: null,
      modifiedFields: [],
      _id: null,
      document: null,
      saving: false,
      saved: false,
      showSubmitModal: false,
      inputData: {
        url: null,
        hash: null,
        authors: null,
        linkedArticles: null,
        contributorRatios: null,
        linkedArticlesSplitRatios: null
      }
    };

    this.updateModifiedFieldsDebounced = debounce(
      this.updateModifiedFields,
      200
    );
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
            _id: response.data._id,
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
    }, 2500);
  }

  componentWillUnmount() {
    if (this.saveInterval) {
      clearInterval(this.saveInterval);
    }
  }

  updateModifiedFields() {
    const modifiedFields = this.getModifiedFields();
    this.setState({modifiedFields});
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

    //TODO: change this
    const i = Math.floor(Math.random() * 40) % 4;
    if (i <= 0) {
      this.save();
    }
    this.updateModifiedFieldsDebounced();
  }

  getModifiedFields() {
    if (!this.state.lastSavedVersion) {
      return [];
    }
    return getChangedFields(this.state.lastSavedVersion, this.state.document);
  }

  save() {
    this.setState({saved: false, saving: true});
    const changedFields = this.getModifiedFields();
    const toSave = new Document(this.state.document);
    let patch = pick(toSave, ...changedFields);
    const draftId = this.props.match.params.id;

    if (toSave.figure.length > 0) {
      patch.figure = toSave.figure;
    }

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
          this.setState({saved: true, saving: false});
        } else {
          this.setState({
            errorMessage: response.error
          });
          this.setState({saved: false, saving: false});
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          errorMessage: 'Ouh. Something went wrong.',
          loading: false
        });
      });
  }

  computeInputData() {
    // TODO: check which fields are missing and display the errors
    const hashedDocument = sha256(JSON.stringify(this.state.document));
    this.setState({
      showSubmitModal: true,
      inputData: {
        ...this.state.inputData,
        hash: hashedDocument,
        authors: this.state.document.authors,
        url: `${getDomain() + '/' + this.state._id}`
      }
    });
  }

  async submit() {
    const ARTICLE1 = {
      articleHash: this.state.inputData.hash,
      url: 'u', //this.state.inputData.url,
      authors: [this.props.selectedAccount.address],
      contributorRatios: [4000, 6000],
      linkedArticles: [
        '5f37e6ef7ee3f86aaa592bce4b142ef345c42317d6a905b0218c7241c8e30015'
      ],
      linkedArticlesSplitRatios: [3334, 3333, 3333]
    };

    // normal API call for storing hash into the db
    const draftId = this.props.match.params.id;
    fetch(`${getDomain()}/api/articles/drafts/${draftId}/submit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        articleHash: '0x' + ARTICLE1.articleHash
      })
    })
      .then(response => response.json())
      .then(async response => {
        if (!response.success) {
          this.setState({errorMessage: response.error});
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          errorMessage: 'Ouh. Something went wrong.',
          loading: false
        });
      });

    // SC call
    const ARTICLE1_DATA_IN_HEX = getArticleHex(this.props.web3, ARTICLE1);

    await submitArticle(
      this.props.tokenContract,
      this.props.selectedAccount.address,
      this.props.platformContract.options.address,
      SUBMISSION_PRICE,
      ARTICLE1_DATA_IN_HEX,
      80000000
    )
      .on('transactionHash', tx => {
        this.props.history.push(`${this.props.base}/submitted?tx=${tx}`);
      })
      .on('receipt', receipt => {
        console.log(
          'The article submission exited with the TX status: ' + receipt.status
        );
        return receipt;
      })
      .catch(err => {
        // MetaMask rejection
        if (err.message.includes('User denied transaction signature')) {
          // revert the state of the document from FINISHED_DRAFT to DRAFT
          fetch(`${getDomain()}/api/articles/drafts/${draftId}/revert`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include'
          })
            .then(response => response.json())
            .then(async response => {
              if (!response.success) {
                this.setState({errorMessage: response.error});
              }
            })
            .catch(err => {
              console.log(err);
              this.setState({
                errorMessage: 'Ouh. Something went wrong.'
              });
            });
        }
        console.error(err);
        this.setState({
          errorMessage:
            'Ouh. Something went wrong with the Smart Contract call: ' +
            err.toString()
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

  renderSelectMenus() {
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
            this.save();
          }}
          type={this.state.document.type}
        />
        <DocumentSubDisciplinePicker
          value={this.state.document.discipline}
          requirement={this.requirementForField('discipline')}
          document={this.state.document}
          mainDisciplines={this.state.document.main_discipline}
          onChange={discipline => {
            this.updateDocument({
              document: {
                ...this.state.document,
                discipline
              }
            });
            this.save();
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
            this.save();
          }}
        />
        {['replication'].includes(this.state.document.type) ? null : (
          <ObservationTypePicker
            value={this.state.document.link.observation_type}
            document={this.state.document}
            requirement={this.requirementForField('link.observation_type')}
            type={this.state.document.type}
            onChange={observation_type => {
              this.updateDocument({
                document: {
                  ...this.state.document,
                  link: {
                    ...this.state.document.link,
                    observation_type
                  }
                }
              });
              this.save();
            }}
          />
        )}
      </div>
    );
  }

  renderModals() {
    return (
      <div>
        <Modal
          noClose
          type={'notification'}
          toggle={isErrorMessage => {
            this.setState({errorMessage: null});
          }}
          action={'GOT IT!'}
          show={this.state.errorMessage}
          title={'You got the following error'}
          callback={() => this.props.history.push(`${this.props.base}/drafts`)}
        >
          {this.state.errorMessage}
        </Modal>
        <Modal
          action={'SUBMIT'}
          type={'notification'}
          toggle={showSubmitModal => {
            this.setState({showSubmitModal});
          }}
          callback={() => {
            this.setState({showSubmitModal: false});
            this.submit();
          }}
          show={this.state.showSubmitModal}
          title={'Do you want to submit this document to be reviewed?'}
        >
          Dear User, this is your input data for our smart contract. Please be
          aware that even a very small change in the document will result in a
          new article hash, i.e., a new manuscript version.
          <SmartContractInputData inputData={this.state.inputData} />
        </Modal>
      </div>
    );
  }

  renderSaveButtons() {
    if (this.state.saving) {
      return (
        <div>
          {' '}
          <Icon
            icon={'cloud-upload'}
            width={20}
            height={20}
            color={__GRAY_600}
          />{' '}
          Saving...
        </div>
      );
    }
    return (
      <div>
        <Icon icon={'cloud'} width={20} height={20} /> All changes saved{' '}
      </div>
    );
  }

  renderFigures() {
    return (
      <div>
        {' '}
        <TitleWithHelper
          field="Figure"
          document={this.state.document}
          requirement={{required: true, hint: 'this is a test rqureiaijsfijas'}}
          title="Figure"
          id="figure"
        />
        <FiguresFlex>
          <DropZoneHandler
            onChangeFigure={f => {
              let figures = this.state.document.figure
                ? this.state.document.figure
                : [];
              let figure = f.contents[0];
              figure.cdn = fromS3toCdn(f.contents[0].url);
              figures.push(figure);

              this.updateDocument({
                document: {
                  ...this.state.document,
                  figure: figures
                }
              });
            }}
          />
          <DocumentFiguresRenderer
            figures={this.state.document.figure}
            onDelete={index => {
              const newFigure = this.state.document.figure.filter(
                (c, i) => i !== index
              );
              this.updateDocument({
                document: {
                  ...this.state.document,
                  figure: newFigure
                }
              });
            }}
          />
        </FiguresFlex>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div>{this.renderModals()}</div>
        {this.state.loading || !this.state.document ? (
          <GridSpinner />
        ) : (
          <Parent>
            <Container>
              <LeftTopContainer>
                <Toolbar />
              </LeftTopContainer>
              <EditorParent>
                <RightTopContainer>
                  <SaveChanges>{this.renderSaveButtons()}</SaveChanges>
                </RightTopContainer>
                <EditorCard>
                  <Title>Write your article</Title>
                  <EditorContent>
                    <Line>{this.renderTitle()}</Line>
                    <Line>{this.renderAuthors()}</Line>
                    <Line>{this.renderSelectMenus()}</Line>
                    <Line>{this.renderFigures()}</Line>
                  </EditorContent>
                  <ButtonContainer>
                    <Button
                      onClick={() => {
                        this.computeInputData();
                      }}
                    >
                      Submit Article
                    </Button>
                  </ButtonContainer>
                </EditorCard>
              </EditorParent>
            </Container>
          </Parent>
        )}
      </div>
    );
  }
}

export default withRouter(DocumentEditor);
