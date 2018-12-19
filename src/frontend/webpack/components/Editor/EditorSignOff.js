import React from 'react';
import styled from 'styled-components';
import GridSpinner from '../../views/spinners/GridSpinner.js';
import Article from '../../views/Article.js';
import {Card} from '../../views/Card.js';
import {__THIRD} from '../../../helpers/colors.js';
import {Link, withRouter} from 'react-router-dom';
import {setSanityToOk} from '../../../../smartcontracts/methods/web3-platform-contract-methods.mjs';
import Modal from '../../design-components/Modal.js';
import withWeb3 from '../../contexts/WithWeb3.js';
import connect from 'react-redux/es/connect/connect.js';
import {fetchArticlesToSignOff} from '../../reducers/editor-methods.js';
import {addTransaction} from '../../reducers/transactions.js';
import toast from '../../design-components/Notification/Toast.js';
import {
  EditorInfoMessage,
  EditorSuccessMessage
} from '../../constants/Messages.js';
import SC_TRANSACTIONS_TYPE from '../../../../backend/schema/sc-transaction-state-enum.mjs';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const NoArtDiv = styled.div`
  display: flex;
  font-style: italic;
  margin-top: 25px;
  color: ${__THIRD};
  font-size: 16px;
`;
const NoArticles = () => {
  return (
    <NoArtDiv>
      You don't have any articles to sign off. If you want to assign yourself to
      an article{' '}
      <Link to={'/app/editor/articles'} style={{marginLeft: 2.5}}>
        {' '}
        <strong>click here.</strong>
      </Link>
    </NoArtDiv>
  );
};
class EditorSignOff extends React.Component {
  constructor() {
    super();
    this.state = {
      articleOnHover: null
    };
  }

  async componentDidMount() {
    this.props.fetchArticlesToSignOff();
  }

  signOffArticle(article, articleHash) {
    setSanityToOk(this.props.context.platformContract, articleHash)
      .send({
        from: this.props.selectedAccount.address
      })
      .on('transactionHash', tx => {
        this.props.addTransaction(SC_TRANSACTIONS_TYPE.SANITY_OK, tx);
        toast.info(
          <EditorInfoMessage
            path={'signoff'}
            text={'Your article will be signed off in the next minutes.'}
          />
        );
      })
      .on('receipt', async receipt => {
        console.log('Sanity check:  ' + receipt.status);
        this.props.fetchArticlesToSignOff();
        toast.success(
          <EditorSuccessMessage
            path={'invite'}
            articleId={article._id}
            text={`The article has been successfully signed off`}
          />
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
          show={this.state.errorMessage || this.props.errorMessage}
          title={'You got the following error'}
        >
          {this.state.errorMessage || this.props.errorMessage}
        </Modal>
      </div>
    );
  }

  render() {
    return (
      <Container>
        {this.renderModals()}
        {this.props.loading ? (
          <GridSpinner />
        ) : (
          <Card title={'Sign Off Articles'}>
            {this.props.articles ? (
              this.props.articles.length > 0 ? (
                this.props.articles.map(article => {
                  return (
                    <Article
                      show={this.state.articleOnHover === article._id}
                      buttonText={'Sign off'}
                      key={article._id}
                      article={article}
                      onMouseEnter={obj => {
                        this.setState({articleOnHover: obj._id});
                      }}
                      onMouseLeave={obj => {
                        this.setState({articleOnHover: null});
                      }}
                      action={(_, article) => {
                        this.signOffArticle(article, article.articleHash);
                      }}
                    />
                  );
                })
              ) : (
                <NoArticles />
              )
            ) : (
              <NoArticles />
            )}
          </Card>
        )}
      </Container>
    );
  }
}

export default withWeb3(
  withRouter(
    connect(
      state => ({
        selectedAccount: state.accountsData.selectedAccount,
        articles: state.editorsData.articlesToSignOff,
        loading: state.editorsData.loadingSignOff,
        errorMessage: state.editorsData.errorSignOff
      }),
      dispatch => ({
        fetchArticlesToSignOff: () => {
          dispatch(fetchArticlesToSignOff());
        },
        addTransaction: (txType, tx) => {
          dispatch(addTransaction(txType, tx));
        }
      })
    )(EditorSignOff)
  )
);
