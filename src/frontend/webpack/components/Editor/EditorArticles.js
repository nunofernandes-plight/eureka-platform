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
import {isGanache} from '../../../../helpers/isGanache.mjs';
import Pagination from './Pagination.js';
import withWeb3 from '../../contexts/WithWeb3.js';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Articles = styled.div`
  display: flex;
  flex-direction: column;
  width: 95%;
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
      showTxModal: false,
      page: 1,
      limit: 10,
      nrOfPages: 1
    };
  }

  handleQuery = (field, value) => {
    this.setState({[field]: value});
  };

  componentDidMount() {
    this.setState({loading: true});
    this.getSubmissions(1);
  }

  getSubmissions(page) {
    this.setState({page});
    getUnassignedSubmissions(page, this.state.limit)
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          this.setState({
            articles: response.data.array,
            nrOfPages: response.data.nrOfPages
          });
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

  async assignArticle(scSubmissionID) {
    let gasAmount;
    // gas estimation on ganache doesn't work properly
    if (!isGanache(this.props.context.web3))
      gasAmount = await assignForSubmissionProcess(
        this.props.context.platformContract,
        scSubmissionID
      ).estimateGas({
        from: this.props.selectedAccount.address
      });
    else gasAmount = 80000000;

    assignForSubmissionProcess(this.props.context.platformContract, scSubmissionID)
      .send({
        from: this.props.selectedAccount.address,
        gas: gasAmount
      })
      .on('transactionHash', tx => {
        // this.setState({
        //   tx,
        //   showTxModal: true
        // });
      })
      .on('receipt', receipt => {
        console.log(
          'Assigning the editor to the submission exited with the TX status: ' +
            receipt.status
        );
        this.props.history.push(`/app/editor/signoff`);
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
        <Card title={'Assign articles'}>
          <EditorQuerySection
            checked={this.state.filtersActive}
            handleFilters={filtersActive => {
              this.setState({filtersActive});
            }}
            handleQuery={(field, value) => {
              this.handleQuery(field, value);
            }}
          />

          <Pagination
            currentPage={this.state.page}
            totalPages={this.state.nrOfPages}
            limit={this.state.limit}
            goToPage={page => {
              this.getSubmissions(page);
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
                    onMouseEnter={obj => {
                      this.setState({articleOnHover: obj._id});
                    }}
                    onMouseLeave={obj => {
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

export default withWeb3(withRouter(EditorArticles));
