import React from 'react';
import styled from 'styled-components';
import {withRouter} from 'react-router-dom';
import {Card} from '../views/Card.js';
import {getDomain} from '../../../helpers/getDomain.js';
import Modal from '../design-components/Modal.js';
import SubmittedTable from '../views/SubmittedTable.js';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../design-components/Notification.css';

const Container = styled.div``;

class MySubmitted extends React.Component {
  constructor() {
    super();
    this.state = {
      articlesLoading: false,
      errorMessage: null,
      submitted: null
    };
  }

  componentDidMount() {
    this.fetchYourArticles();

    const tx = MySubmitted.getParameterByName('tx');
    if (tx) {
      toast(
        'Your article has been submitted to our Smart Contract and has the following transaction hash: ' +
          tx,
        {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 200000,
          className: '__ALERT_SUCCESS',
          progressClassName: '__BAR'
        }
      );
    }
  }

  static getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
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
      </div>
    );
  }

  render() {
    return (
      <Container>
        {this.renderModals()}
        <ToastContainer />
        <Card width={1000} title={'My Submitted Documents'}>
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
