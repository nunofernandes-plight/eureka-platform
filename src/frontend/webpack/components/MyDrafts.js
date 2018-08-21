import React from 'react';
import styled from 'styled-components';
import DraftsTable from '../views/DraftsTable.js';
import {Card, CardTitle} from '../views/Card.js';
import {__ALERT_ERROR, __MAIN} from '../../helpers/colors.js';
import {getDomain} from '../../../helpers/getDomain.js';
import Modal from '../design-components/Modal.js';
import CircleSpinner from '../views/spinners/CircleSpinner.js';
import Icon from '../views/icons/Icon.js';

const TitleContainer = styled.div`
  &::before {
    content: '';
    margin: 1px auto 1px 1px;
    visibility: hidden;
    padding: 35px;
    background: #ddd;
  }
  width: 100%;
  display: flex;
  color: ${__ALERT_ERROR} !important;
  align-items: center;
  justify-content: center;
`;

class MyDrafts extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      fetchingArticlesLoading: false,
      errorMessage: null,
      drafts: null,
      showDeleteModal: false,
      draftToDelete: null
    };
  }

  componentDidMount() {
    this.fetchYourArticles();
  }

  createNewArticle() {
    this.setState({loading: true});
    fetch(`${getDomain()}/api/articles/drafts/new`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          this.props.history.push(`${this.props.base}/${response.data._id}`);
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

  fetchYourArticles() {
    this.setState({fetchingArticlesLoading: true});
    fetch(`${getDomain()}/api/articles/drafts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          this.setState({drafts: response.data});
        } else {
          this.setState({
            errorMessage: response.error,
            fetchingArticlesLoading: false
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          errorMessage: 'Ouh. Something went wrong.',
          fetchingArticlesLoading: false
        });
      });
  }

  deleteDraft() {
    fetch(`${getDomain()}/api/articles/drafts/${this.state.draftToDelete}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          this.fetchYourArticles();
        } else {
          this.setState({
            errorMessage: response.error,
            fetchingArticlesLoading: false
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          errorMessage: 'Ouh. Something went wrong.',
          fetchingArticlesLoading: false
        });
      });
  }

  renderModal() {
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
          action={'DELETE'}
          type={'notification'}
          callback={() => {
            this.setState({showDeleteModal: false});
            this.deleteDraft();
          }}
          toggle={showDeleteModal => {
            this.setState({showDeleteModal});
          }}
          show={this.state.showDeleteModal}
          title={'Delete Draft'}
        >
          Are you sure you want to delete this draft? This action will be
          permanent.
        </Modal>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderModal()}
        <Card width={1160}>
          <TitleContainer>
            <CardTitle style={{margin: 0}}>My Drafts</CardTitle>
            <Icon
              style={{marginLeft: 'auto', marginRight: '35px'}}
              icon={'material'}
              material={'loupe'}
              width={45}
              color={__MAIN}
              onClick={() => this.createNewArticle()}
            />
          </TitleContainer>
          {this.state.drafts ? (
            <DraftsTable
              drafts={this.state.drafts}
              base={this.props.base}
              onDelete={_id => {
                this.setState({
                  showDeleteModal: true,
                  draftToDelete: _id
                });
              }}
            />
          ) : (
            <div style={{marginTop: 25}}>
              <CircleSpinner />
            </div>
          )}
        </Card>
      </div>
    );
  }
}

export default MyDrafts;
