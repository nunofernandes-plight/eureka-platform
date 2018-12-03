import React, {Fragment} from 'react';
import styled from 'styled-components';
import {withRouter} from 'react-router-dom';
import DraftsTable from '../../../views/DraftsTable.js';
import {Card, CardTitle} from '../../../views/Card.js';
import {__ALERT_ERROR, __FIFTH} from '../../../../helpers/colors.js';
import {getDomain} from '../../../../../helpers/getDomain.mjs';
import Modal from '../../../design-components/Modal.js';
import CircleSpinner from '../../../views/spinners/CircleSpinner.js';
import Icon from '../../../views/icons/Icon.js';
import queryString from 'query-string';
import {connect} from 'react-redux';
import {fetchUserData} from '../../../reducers/user.js';
import {fetchOnlineDrafts} from '../../../reducers/articles.js';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const TitleContainer = styled.div`
  &::before {
    content: '';
    margin: 1px auto 1px 1px;
    visibility: hidden;
    padding: 35px;
    background: #ddd;
  }
  margin-top: -47px;
  width: 100%;
  display: flex;
  color: ${__ALERT_ERROR} !important;
  align-items: center;
  justify-content: center;
`;

const Circle = styled.div`
  &:hover {
    transform: translateY(3px);
    cursor: pointer;
  }
  border-radius: 50%;
  padding: 0.75rem;
  transition: 0.3s all;
  margin-left: auto;
  margin-right: 25px;
  color: #fff;
  background-color: ${__FIFTH};
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
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
      draftToDelete: null,
      authorsData: null,
      loadingAuthor: false
    };
  }

  componentDidMount() {
    this.props.fetchOnlineDrafts();
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
          this.props.fetchUserData();
          this.props.history.push(
            `${this.props.base}/${response.data.articleVersionId}`
          );
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

  getAuthor(address) {
    this.setState({loadingAuthor: true});
    const query = queryString.stringify({
      ethAddress: address
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
        this.setState({loadingAuthor: false});
      })
      .catch(err => {
        this.setState({loadingAuthor: false});
        console.error(err);
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
      <Fragment>
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
      </Fragment>
    );
  }

  render() {
    return (
      <Fragment>
        {this.renderModal()}
        <TitleContainer>
          <Circle onClick={() => this.createNewArticle()}>
            <Icon icon={'material'} material={'add'} width={25} />
          </Circle>
        </TitleContainer>
        {this.props.onlineDraftsLoading ? (
          <div style={{marginTop: 25}}>
            <CircleSpinner />
          </div>
        ) : (
          <DraftsTable
            loadingAuthor={this.state.loadingAuthor}
            getAuthor={address => this.getAuthor(address)}
            authorsData={this.state.authorsData}
            base={this.props.base}
            onSubmit={() => this.createNewArticle()}
            onDelete={_id => {
              this.setState({showDeleteModal: true, draftToDelete: _id});
            }}
          />
        )}
      </Fragment>
    );
  }
}

export default withRouter(
  connect(
    state => ({
      onlineDrafts: state.articlesData.onlineDrafts,
      onlineDraftsLoading: state.articlesData.onlineDraftsLoading
    }),
    dispatch => {
      return {
        fetchUserData: () => {
          dispatch(fetchUserData());
        },
        fetchOnlineDrafts: () => {
          dispatch(fetchOnlineDrafts());
        }
      };
    }
  )(MyDrafts)
);
