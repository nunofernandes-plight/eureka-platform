import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import styled from 'styled-components';
import queryString from 'query-string';
import {Card} from '../views/Card.js';
import sha256 from 'js-sha256';
import {getDomain} from '../../../helpers/getDomain.js';
import GridSpinner from '../views/spinners/GridSpinner.js';
import './TextEditor/new-article.css';
import 'draft-js/dist/Draft.css';
import {deserializeDocument} from '../../../helpers/documentSerializer.mjs';
import getChangedFields from '../../../helpers/compareDocuments.js';
import {pick, debounce} from 'underscore';
import DocumentPickers from './TextEditor/DocumentPickers.js';
import Modal from '../../webpack/design-components/Modal.js';
import SmartContractInputData from '../views/SmartContractInputData.js';
import {SUBMISSION_PRICE} from '../constants/Constants.js';
import {submitArticle} from '../../../smartcontracts/methods/web3-token-contract-methods.mjs';
import {
  fetchArticle,
  submitArticleDB,
  revertArticleToDraft,
  saveArticle
} from './TextEditor/DocumentMainMethods.js';
import ARTICLE_VERSION_STATE from '../../../backend/schema/article-version-state-enum.mjs';
import Document from '../../../models/Document.mjs';
import DocumentTitle from './TextEditor/DocumentTitle.js';
import DocumentFigures from './TextEditor/DocumentFigures.js';
import DocumentAuthors from './TextEditor/DocumentAuthors.js';
import DocumentLeftPart from './TextEditor/DocumentLeftPart.js';
import DocumentRightPart from './TextEditor/DocumentRightPart.js';
import getArticleHex from '../../../smartcontracts/methods/get-articleHex.mjs';
import UsersSelection from './UsersSelection.js';
import Roles from '../../../backend/schema/roles-enum.mjs';
import {isGanache} from '../../../helpers/isGanache.mjs';

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

const EditorContent = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 100%;
`;

const Line = styled.div`
  margin: 15px 0;
`;

const ButtonContainer = styled.div`
  align-self: center;
`;
const Button = styled.button``;

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
      addAuthorModal: false,
      authorsData: null,
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
    fetchArticle(draftId)
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
          this.fetchAuthorsData();
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
      if (
        this.state.document.articleVersionState === ARTICLE_VERSION_STATE.DRAFT
      ) {
        this.save();
      }
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

    patch.authors = toSave.authors;
    if (toSave.figure.length > 0) {
      patch.figure = toSave.figure;
    }

    saveArticle(draftId, patch)
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

  getArticle() {
    return {
      articleHash: this.state.inputData.hash,
      url: 'u', //this.state.inputData.url,
      authors: [this.props.selectedAccount.address],
      contributorRatios: [4000, 6000],
      linkedArticles: [
        '5f37e6ef7ee3f86aaa592bce4b142ef345c42317d6a905b0218c7241c8e30015'
      ],
      linkedArticlesSplitRatios: [3334, 3333, 3333]
    };
  }

  async submit() {
    this.save();
    const article = this.getArticle();
    // normal API call for storing hash into the db
    const draftId = this.props.match.params.id;
    submitArticleDB(draftId, article)
      .then(response => response.json())
      .then(response => {
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

    let gasAmount;
    // gas estimation on ganache doesn't work properly
    if (!isGanache(this.props.web3))
      gasAmount = await submitArticle(
        this.props.tokenContract,
        this.props.platformContract.options.address,
        SUBMISSION_PRICE,
        getArticleHex(this.props.web3, article)
      ).estimateGas({
        from: this.props.selectedAccount.address
      });
    else gasAmount = 80000000;

    await submitArticle(
      this.props.tokenContract,
      this.props.platformContract.options.address,
      SUBMISSION_PRICE,
      getArticleHex(this.props.web3, article)
    )
      .send({
        from: this.props.selectedAccount.address,
        gas: gasAmount
      })
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
        // revert the state of the document from FINISHED_DRAFT to DRAFT
        console.error(err);
        revertArticleToDraft(draftId)
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

        this.setState({
          errorMessage:
            'Ouh. Something went wrong with the Smart Contract call: ' +
            err.toString()
        });
      });
  }

  fetchAuthorsData() {
    const query = queryString.stringify({
      ethAddress: this.state.document.authors
    });

    fetch(`${getDomain()}/api/users?${query}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          let authorsData = Array.isArray(response.data)
            ? response.data
            : [response.data];
          this.setState({authorsData});
        }
      })
      .catch(err => {
        console.error(err);
      });
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
        <Modal
          action={'SAVE'}
          toggle={addAuthorModal => {
            this.setState({addAuthorModal});
          }}
          callback={() => {
            this.save();
            this.setState({addAuthorModal: false});
          }}
          show={this.state.addAuthorModal}
          title={'Search and add authors for your manuscript.'}
        >
          <UsersSelection
            listedTitle={'Authors'}
            searchableRoles={Roles.ALL}
            listedUsers={this.state.authorsData}
            cannotBeDeleted={this.props.selectedAccount.address}
            addToList={u => {
              const authors = this.state.document.authors;
              authors.push(u.ethereumAddress);
              this.updateDocument({
                document: {
                  ...this.state.document,
                  authors
                }
              });
              this.fetchAuthorsData();
            }}
            deleteFromList={u => {
              const authors = this.state.document.authors;
              const indexToDelete = authors.indexOf(u.ethereumAddress);
              if (indexToDelete > -1) {
                authors.splice(indexToDelete, 1);
              }
              this.updateDocument({
                document: {
                  ...this.state.document,
                  authors
                }
              });
              this.fetchAuthorsData();
            }}
          />
        </Modal>
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
              <DocumentLeftPart />
              <EditorParent>
                <DocumentRightPart saving={this.state.saving} />
                <Card
                  style={{padding: '40px 80px', marginTop: '21px'}}
                  width={1070}
                  title={'Write your article'}
                >
                  <EditorContent>
                    <Line>
                      <DocumentTitle
                        document={this.state.document}
                        onTitleChange={title => {
                          this.onTitleChange(title);
                        }}
                      />
                    </Line>
                    <Line>
                      <DocumentAuthors
                        addAuthor={() => {
                          this.setState({addAuthorModal: true});
                        }}
                        authorsData={this.state.authorsData}
                      />
                    </Line>
                    <Line>
                      <DocumentPickers
                        document={this.state.document}
                        updateDocument={({document}) => {
                          this.updateDocument({document});
                        }}
                        save={() => this.save()}
                      />
                    </Line>
                    <Line>
                      <DocumentFigures
                        document={this.state.document}
                        updateDocument={({document}) => {
                          this.updateDocument({document});
                        }}
                      />
                    </Line>
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
                </Card>
              </EditorParent>
            </Container>
          </Parent>
        )}
      </div>
    );
  }
}

export default withRouter(DocumentEditor);
