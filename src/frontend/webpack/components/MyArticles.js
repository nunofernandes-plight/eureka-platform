import React, {Component} from 'react';
import styled from 'styled-components';
import {Card, CardTitle} from '../views/Card.js';
import {withRouter} from 'react-router-dom';
import {__ALERT_ERROR, __THIRD} from '../../helpers/colors.js';
import {getDomain} from '../../../helpers/getDomain.js';
import Modal from '../design-components/Modal.js';
import CircleSpinner from '../views/spinners/CircleSpinner.js';
import MyDrafts from '../views/MyDrafts.js';
import Icon from '../views/icons/Icon.js';

const Parent = styled.div`
  display: flex;
  flex-direction: column;
`;

const CardContainer = styled.div`
  transition: all 0.5s;
  display: flex;
  max-width: 1200px;
  justify-content: center;
  margin: 0 auto;
`;

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

const IconContainer = styled.div`
  &:hover {
    background: ${__THIRD};
    color: white;
  }
  border: 1px solid ${__THIRD};
  border-radius: 50%;
  padding: 10px;
  transition: all 0.15s ease;
  cursor: pointer;
`;

const Paragraph = styled.p``;
// const LeftCard = Card.extend`
//   width: 500px;
//   align-self: center;
//   margin-top: 2em;
// `;
//
// const RightCard = Card.extend`
//   width: 1160px;
// `;

const List = styled.ul`
  list-style: none;
  padding-left: 0;
  margin-top: 0;
`;

const Element = styled.div`
  display: flex;
  align-items: center;
`;

const Bullet = styled.li`
  padding-bottom: 0.5rem !important;
  padding-left: 15px;
  padding-right: 15px;
`;

const Text = styled.div``;

const IContainer = styled.div`
  background-color: rgb(76, 174, 243, 0.2);
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  margin-right: 10px;
`;

class MyArticles extends Component {
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
      <Parent>
        {this.renderModal()}
        <CardContainer>
          <Card width={1160}>
            <TitleContainer>
              <CardTitle style={{margin: 0}}>My Drafts</CardTitle>
              <Icon
                style={{marginLeft: 'auto', marginRight: '35px'}}
                icon={'material'}
                material={'add_to_photos'}
                width={40}
              />
            </TitleContainer>
            {this.state.drafts ? (
              <MyDrafts
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

          {/*<LeftCard>*/}
          {/*<h2>Submit an Article</h2>*/}
          {/*<IconContainer onClick={() => this.createNewArticle()}>*/}
          {/*<Icon icon={'plus'} width={40} height={40} />*/}
          {/*</IconContainer>*/}
          {/*<Paragraph>Create your narrative bit by bit.</Paragraph>*/}
          {/*<List>*/}
          {/*<Bullet>*/}
          {/*<Element>*/}
          {/*<IContainer>*/}
          {/*<Icon*/}
          {/*icon={'ethereum'}*/}
          {/*width={15}*/}
          {/*height={15}*/}
          {/*color={__THIRD}*/}
          {/*/>*/}
          {/*</IContainer>*/}

          {/*<Text>Fully integrated with the Ethereum Blockchain</Text>*/}
          {/*</Element>*/}
          {/*</Bullet>*/}

          {/*<Bullet>*/}
          {/*<Element>*/}
          {/*<IContainer>*/}
          {/*<Icon*/}
          {/*icon={'edit'}*/}
          {/*width={13}*/}
          {/*height={13}*/}
          {/*color={__THIRD}*/}
          {/*/>*/}
          {/*</IContainer>*/}

          {/*<Text>Next-generation online editor</Text>*/}
          {/*</Element>*/}
          {/*</Bullet>*/}

          {/*<Bullet>*/}
          {/*<Element>*/}
          {/*<IContainer>*/}
          {/*<Icon*/}
          {/*icon={'check'}*/}
          {/*width={13}*/}
          {/*height={13}*/}
          {/*color={__THIRD}*/}
          {/*/>*/}
          {/*</IContainer>*/}

          {/*<Text>Fairly rewarded peer-review process</Text>*/}
          {/*</Element>*/}
          {/*</Bullet>*/}
          {/*</List>*/}
          {/*</LeftCard>*/}
        </CardContainer>
      </Parent>
    );
  }
}

export default withRouter(MyArticles);
