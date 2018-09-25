import React from 'react';
import styled from 'styled-components';
import {Card} from '../../views/Card.js';
import EditorQuerySection from './EditorQuerySection.js';
import {getUnassignedSubmissions} from './EditorMethods.js';
import Modal from '../../design-components/Modal.js';
import Article from '../../views/Article.js';
import GridSpinner from '../../views/spinners/GridSpinner.js';
import {assignForSubmissionProcess} from '../../../../smartcontracts/methods/web3-platform-contract-methods.mjs';
import {withRouter} from 'react-router-dom';
import {getEtherscanLink} from '../../../../helpers/getEtherscanLink.js';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1em;
`;

const Articles = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 1em;
`;

class EditorArticles extends React.Component {
  constructor() {
    super();
    this.state = {
      query: null,
      articles: null,
      filtersActive: false,
      loading: false,
      articleOnHover: null,
      tx: null,
      showTxModal: false
    };
  }

  handleQuery = (field, value) => {
    this.setState({[field]: value});
  };

  componentDidMount() {
    this.setState({loading: true});
    getUnassignedSubmissions()
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          this.setState({articles: response.data});
        } else {
          this.setState({
            errorMessage: response.error,
            loading: false
          });
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

  assignArticle(scSubmissionID) {
    assignForSubmissionProcess(
      this.props.platformContract,
      scSubmissionID,
      this.props.selectedAccount.address
    )
      .on('transactionHash', tx => {
        this.setState({
          tx,
          showTxModal: true
        });
      })
      .on('receipt', receipt => {
        console.log(
          'Assigning the editor to the submission exited with the TX status: ' +
            receipt.status
        );
        return receipt;
      })
      .catch(err => {
        console.error(err);
        this.setState({
          errorMessage:
            'Ouh. Something went wrong with the Smart Contract call: ' +
            err.toString()
        });
      });
  }

  renderModals() {
    return (
      <div>
        <Modal
          type={'notification'}
          toggle={isErrorMessage => {
            this.setState({errorMessage: null});
          }}
          show={this.state.errorMessage}
          title={'You got the following error'}
        >
          {this.state.errorMessage}
        </Modal>

        <Modal
          action={'GOT IT'}
          callback={() => {
            this.setState({showTxModal: false});
            this.props.history.push(`/app/editor/signoff`);
          }}
          noClose
          show={this.state.showTxModal}
          title={'Your article has been successfully submitted!'}
        >
          Dear editor, your request for assigning yourself to this article
          submission process has successfully triggered our Smart Contract. If
          you are interested, you can track the Blockchain approval process at
          the following link: <br />
          <a
            href={getEtherscanLink(this.props.network) + 'tx/' + this.state.tx}
            target={'_blank'}
          >
            {this.state.tx}{' '}
          </a>
        </Modal>
      </div>
    );
  }

  render() {
    return (
      <Container>
        {this.renderModals()}
        <Card width={1000} title={'Assign articles'}>
          <EditorQuerySection
            checked={this.state.filtersActive}
            handleFilters={filtersActive => {
              this.setState({filtersActive});
            }}
            handleQuery={(field, value) => {
              this.handleQuery(field, value);
            }}
          />

          {!this.state.articles ? (
            <GridSpinner />
          ) : (
            <Articles>
              {this.state.articles.map(article => {
                return (
                  <Article
                    buttonText={'Assign article to me'}
                    key={article._id}
                    onHover={this.state.articleOnHover === article._id}
                    article={article}
                    onMouseEnter={id => {
                      this.setState({articleOnHover: id});
                    }}
                    onMouseLeave={() => {
                      this.setState({articleOnHover: null});
                    }}
                    action={id => {
                      this.assignArticle(id);
                    }}
                  />
                );
              })}
            </Articles>
          )}
        </Card>
      </Container>
    );
  }
}

export default withRouter(EditorArticles);
