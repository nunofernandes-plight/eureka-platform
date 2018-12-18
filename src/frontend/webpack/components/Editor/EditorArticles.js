import React from 'react';
import styled from 'styled-components';
import {Card} from '../../views/Card.js';
import EditorQuerySection from './EditorQuerySection.js';
import Modal from '../../design-components/Modal.js';
import Article from '../../views/Article.js';
import GridSpinner from '../../views/spinners/GridSpinner.js';
import {assignForSubmissionProcess} from '../../../../smartcontracts/methods/web3-platform-contract-methods.mjs';
import {withRouter} from 'react-router-dom';
import {isGanache} from '../../../../helpers/isGanache.mjs';
import Pagination from './Pagination.js';
import withWeb3 from '../../contexts/WithWeb3.js';
import connect from 'react-redux/es/connect/connect.js';
import {fetchUnassignedSubmissions} from '../../reducers/editor-methods.js';
import {TITLE_GENERAL_ERROR} from '../../constants/ModalErrors.js';
import 'react-toastify/dist/ReactToastify.css';
import '../../design-components/Notification.css';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {ARTICLE_ASSIGNED_TX} from '../../constants/Messages.js';
import {addTransaction} from '../../reducers/transactions.js';
import SC_TRANSACTIONS_TYPE from '../../../../backend/schema/sc-transaction-state-enum.mjs';

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
      filtersActive: false,
      articleOnHover: null,
      tx: null,
      showTxModal: false
    };
  }

  handleQuery = (field, value) => {
    this.setState({[field]: value});
  };

  componentDidMount() {
    this.getSubmissions(1);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.errorMessage &&
      prevProps.errorMessage !== this.props.errorMessage
    ) {
      this.setState({showModal: true});
    }
  }

  getSubmissions(page) {
    this.setState({page});
    this.props.fetchUnassignedSubmissions(page);
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

    assignForSubmissionProcess(
      this.props.context.platformContract,
      scSubmissionID
    )
      .send({
        from: this.props.selectedAccount.address,
        gas: gasAmount
      })
      .on('transactionHash', tx => {
        this.props.fetchUnassignedSubmissions(this.state.page);
        this.props.addTransaction(
          SC_TRANSACTIONS_TYPE.EDITOR_ARTICLE_ASSIGNMENT,
          tx
        );
        toast(ARTICLE_ASSIGNED_TX(tx), {
          position: toast.POSITION.TOP_LEFT,
          autoClose: 8000,
          className: '__ALERT_SUCCESS',
          progressClassName: '__BAR'
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
      <Modal
        type={'notification'}
        toggle={() => {
          this.setState({showModal: false});
        }}
        show={this.state.showModal}
        title={TITLE_GENERAL_ERROR}
      >
        {this.props.errorMessage}
      </Modal>
    );
  }

  render() {
    return (
      <Container>
        <ToastContainer />
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
            totalPages={this.props.nrOfPages}
            goToPage={page => {
              this.getSubmissions(page);
            }}
          />

          {!this.props.articles ? (
            <GridSpinner />
          ) : (
            <Articles>
              {this.props.articles.map(article => {
                return (
                  <Article
                    buttonText={'Assign to me'}
                    key={article._id}
                    onHover={this.state.articleOnHover === article._id}
                    article={article}
                    onMouseEnter={obj => {
                      this.setState({articleOnHover: obj._id});
                    }}
                    onMouseLeave={obj => {
                      this.setState({articleOnHover: null});
                    }}
                    action={async id => {
                      await this.assignArticle(id);
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

export default withWeb3(
  withRouter(
    connect(
      state => ({
        articles: state.editorsData.articles,
        nrOfPages: state.editorsData.nrOfPages,
        loading: state.editorsData.loading,
        errorMessage: state.editorsData.error,
        selectedAccount: state.accountsData.selectedAccount
      }),
      dispatch => {
        return {
          fetchUnassignedSubmissions: page => {
            dispatch(fetchUnassignedSubmissions(page));
          },
          addTransaction: (txType, tx) => {
            dispatch(addTransaction(txType, tx));
          }
        };
      }
    )(EditorArticles)
  )
);
