import React from 'react';
import styled from 'styled-components';
import {withRouter} from 'react-router-dom';
import {Card} from '../views/Card.js';
import {getDomain} from '../../../helpers/getDomain.mjs';
import Modal from '../design-components/Modal.js';
import SubmittedTable from '../views/SubmittedTable.js';
import {getEtherscanLink} from '../../../helpers/getEtherscanLink.js';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

class MySubmitted extends React.Component {
  constructor() {
    super();
    this.state = {
      articlesLoading: false,
      errorMessage: null,
      submitted: null,
      tx: null,
      showTxModal: false
    };
  }

  async componentDidMount() {
    this.fetchYourArticles();
    this.interval = setInterval(async () => {
      this.fetchYourArticles();
    }, 3500);

    const tx = MySubmitted.getParameterByName('tx');
    // if (tx) {
    //   this.setState({showTxModal: true, tx});
    // }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  static getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) {
      return null;
    }
    if (!results[2]) {
      return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  fetchYourArticles() {
    this.setState({articlesLoading: true});
    fetch(`${getDomain()}/api/articles/submitted`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          this.setState({submitted: response.data});
        } else {
          this.setState({
            errorMessage: response.error,
            articlesLoading: false
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          errorMessage: 'Ouh. Something went wrong.',
          articlesLoading: false
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
            this.props.history.push(`${this.props.base}`);
          }}
          noClose
          show={this.state.showTxModal}
          title={'Your article has been successfully submitted!'}
        >
          Dear user, your article has successfully triggered our Smart Contract.
          If you are interested, you can track the Blockchain approval process
          at the following link:{' '}
          <a
            href={getEtherscanLink(this.props.network) + 'tx/' + this.state.tx}
            target={'_blank'}
          >
            {this.state.tx}{' '}
          </a>.
          <br />
          We will inform you once the blockchain-based peer-review process will
          start.
        </Modal>
      </div>
    );
  }

  render() {
    return (
      <Container>
        {this.renderModals()}
        <Card title={'My Submitted Documents'}>
          <SubmittedTable
            base={this.props.base}
            submitted={this.state.submitted}
            onPreview={_id => {
              this.props.onPreview(_id);
            }}
          />
        </Card>
      </Container>
    );
  }
}

export default withRouter(MySubmitted);
