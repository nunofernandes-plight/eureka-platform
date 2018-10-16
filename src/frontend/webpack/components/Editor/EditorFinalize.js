import React from 'react';
import styled from 'styled-components';
import {getArticlesToFinalize} from './EditorMethods.js';
import GridSpinner from '../../views/spinners/GridSpinner.js';
import Article from '../../views/Article.js';
import {Card} from '../../views/Card.js';
import {__THIRD} from '../../../helpers/colors.js';
import {Link, withRouter} from 'react-router-dom';
import {
  acceptArticleVersion,
  declineArticleVersion
} from '../../../../smartcontracts/methods/web3-platform-contract-methods.mjs';
import Modal from '../../design-components/Modal.js';
import TxHash from '../../views/TxHash.js';

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
      There are currently no articles to finalize. If you want to assign
      yourself to an article{' '}
      <Link to={'/app/editor/articles'} style={{marginLeft: 2.5}}>
        {' '}
        <strong>click here.</strong>
      </Link>
    </NoArtDiv>
  );
};
class EditorFinalize extends React.Component {
  constructor() {
    super();
    this.state = {
      articles: null,
      loading: false,
      articleOnHover: null,
      tx: null
    };
  }

  async componentDidMount() {
    await this.getArticlesToFinalize();
  }

  async getArticlesToFinalize() {
    this.setState({loading: true});
    return getArticlesToFinalize()
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

  acceptArticle(articleHash) {
    acceptArticleVersion(this.props.platformContract, articleHash)
      .send({
        from: this.props.selectedAccount.address
      })
      .on('transactionHash', tx => {
        this.setState({
          tx
        });
      })
      .on('receipt', async receipt => {
        console.log(
          'Accepting article version with article hash ' +
            articleHash +
            ' exits with status ' +
            receipt.status
        );
        await this.getArticlesToFinalize();
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

  declineArticle(articleHash) {
    declineArticleVersion(this.props.platformContract, articleHash)
      .send({
        from: this.props.selectedAccount.address
      })
      .on('transactionHash', tx => {
        this.setState({
          tx
        });
      })
      .on('receipt', async receipt => {
        console.log(
          'Declining article version with article hash ' +
            articleHash +
            ' exits with status ' +
            receipt.status
        );
        await this.getArticlesToFinalize();
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
          action={'GOT IT'}
          callback={() => {
            this.setState({tx: null});
          }}
          show={this.state.tx}
          title={'We got your request!'}
        >
          The request has successfully triggered our smart contract. You can
          find its tx hash here:{' '}
          <TxHash txHash={this.state.tx}>Transaction Hash</TxHash>. <br />
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
          <Card title={'Finalize these articles:'} width={1000}>
            {this.state.articles ? (
              this.state.articles.length > 0 ? (
                this.state.articles.map(article => {
                  return (
                    <Article
                      buttonText={'Accept this article'}
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
                        this.acceptArticle(article.articleHash);
                      }}
                      button2Text={'Decline Article'}
                      action2={(_, review) => {
                        this.declineArticle(article.articleHash);
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
export default withRouter(EditorFinalize);
