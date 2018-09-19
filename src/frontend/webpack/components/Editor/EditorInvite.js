import React from 'react';
import styled from 'styled-components';
import {getInviteReviewersArticles} from './EditorMethods.js';
import GridSpinner from '../../views/spinners/GridSpinner.js';
import Article from '../../views/Article.js';
import {Card} from '../../views/Card.js';
import {__THIRD} from '../../../helpers/colors.js';
import {Link} from 'react-router-dom';
import {
  getGasInviteReviewersForArticle,
  inviteReviewersForArticle
} from '../../../../smartcontracts/methods/web3-platform-contract-methods.mjs';
import Modal from '../../design-components/Modal.js';
import TxHash from '../../views/TxHash.js';
import {getGasEstimation} from '../../../../smartcontracts/methods/web3-utils-methods.mjs';

const Container = styled.div`
  display: flex;
  flex-direction: column;
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
      You don't have any articles for which you can invite reviewers. If you
      want to assign yourself to an article{' '}
      <Link to={'/app/editor/articles'} style={{marginLeft: 2.5}}>
        {' '}
        <strong>click here.</strong>
      </Link>
    </NoArtDiv>
  );
};
class EditorInvite extends React.Component {
  constructor() {
    super();
    this.state = {
      articles: null,
      loading: false,
      articleOnHover: null
    };
  }

  async componentDidMount() {
    await this.getInviteReviewersArticles();
  }

  async getInviteReviewersArticles() {
    this.setState({loading: true});
    return getInviteReviewersArticles()
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          console.log(response);
          this.setState({articles: response.data});
        }
        this.setState({loading: false});
      })
      .catch(err => {
        this.setState({loading: false});
        console.error(err);
      });
  }

  async chooseArticleToInviteReviewers(articleHash) {
    console.log('open invite modal/view here');

    const reviewers = ['0x9ea02Ac11419806aB9d5A512c7d79AC422cB36F7'];

    const gas = await getGasInviteReviewersForArticle(
      this.props.platformContract,
      articleHash,
      reviewers,
      this.props.selectedAccount.address
    );
    inviteReviewersForArticle(
      this.props.platformContract,
      articleHash,
      reviewers,
      this.props.selectedAccount.address,
      gas
    )
      .on('transactionHash', tx => {
        this.setState({
          tx,
          showTxModal: true
        });
      })
      .on('receipt', async receipt => {
        console.log('Invite Reviewers:  ' + receipt.status);
        await this.getInviteReviewersArticles();
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
          toggle={isTx => {
            this.setState({tx: null});
          }}
          show={this.state.tx}
          title={'We got your request!'}
        >
          The request of inviting the specified reviewers has sucessfully
          triggered the smart contract. You can find the transaction status
          here: <TxHash txHash={this.state.tx}>Transaction Hash</TxHash>. <br />
        </Modal>
      </div>
    );
  }

  render() {
    return (
      <Container>
        {this.renderModals()}
        {this.state.loading ? (
          <GridSpinner />
        ) : (
          <Card title={'Invite to Review an Article'} width={1000}>
            {this.state.articles ? (
              this.state.articles.length > 0 ? (
                this.state.articles.map(article => {
                  return (
                    <Article
                      buttonText={'Invite Reviewers'}
                      key={article._id}
                      article={article}
                      onHover={this.state.articleOnHover === article._id}
                      onMouseEnter={id => {
                        this.setState({articleOnHover: id});
                      }}
                      onMouseLeave={id => {
                        this.setState({articleOnHover: null});
                      }}
                      action={(_, article) => {
                        this.chooseArticleToInviteReviewers(
                          article.articleHash
                        );
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
export default EditorInvite;
