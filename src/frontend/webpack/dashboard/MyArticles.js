import React, {Component} from 'react';
import styled from 'styled-components';
import {TopContainer} from './TopContainer.js';
import {withRouter} from 'react-router-dom';
import Icon from '../icons/Icon.js';
import {__GRAY_200, __THIRD} from '../../helpers/colors.js';
import {getDomain} from '../../../helpers/getDomain.js';
import Modal from '../design-components/Modal.js';
import {renderField} from './editor/DocumentRenderer.js';
import CircleSpinner from '../spinners/CircleSpinner.js';

const Parent = styled.div`
  display: flex;
  flex-direction: column;
`;

const CardContainer = styled.div`
  transition: all 0.5s;
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  justify-content: center;
  margin: 0 auto;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  word-wrap: break-word;
  border: 0.0625rem solid rgba(0, 0, 0, 0.05);
  border-radius: 0.25rem;
  background-color: #ffffff;
  background-clip: border-box;
  box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07) !important;
  align-items: center;
  padding: 1.5em;
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
const LeftCard = Card.extend`
  width: 500px;
  align-self: center;
  margin-top: 2em;
`;

const RightCard = Card.extend`
  width: 1160px;
  margin-top: -130px !important;
`;

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

const DraftsContainer = styled.div`
  font-size: 13px;
  width: 100%;
  padding: 2em;
`;

const Drafts = styled.table`
  width: 100%;
  text-align: left;
  position: relative;
  border-collapse: collapse;
  white-space: nowrap;
`;

const TableTitle = styled.p`
  font-size: 16px;
  font-weight: bold;
`;

const Tr = styled.tr`
  &:hover {
    background: ${__GRAY_200};
  }
  transition: 0.5s all;
`;

class MyArticles extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      fetchingArticlesLoading: true,
      errorMessage: null,
      drafts: null
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
          this.props.history.push(
            `${this.props.base}` + '/' + response.data._id
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

  fetchYourArticles() {
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
          console.log(response.data);
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

  renderModal() {
    return (
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
    );
  }

  render() {
    return (
      <Parent>
        {this.renderModal()}
        <TopContainer />

        <CardContainer>
          <RightCard>
            <h2>Your Drafts</h2>
            {this.state.drafts ? (
              <DraftsContainer>
                <Drafts>
                  <tbody>
                    <tr>
                      <th />
                      <th>
                        <TableTitle>Name</TableTitle>
                      </th>
                      <th>
                        <TableTitle>Title</TableTitle>
                      </th>
                      <th>
                        <TableTitle>URL</TableTitle>
                      </th>
                      <th>
                        <TableTitle>Edit</TableTitle>
                      </th>
                      <th />
                    </tr>
                  </tbody>

                  <tbody>
                    {this.state.drafts.map(draft => (
                      <Tr key={draft._id}>
                        <td style={{padding: '20px 15px'}}>
                          <Icon icon={'file'} width={20} height={20} />
                        </td>
                        <td>{renderField(draft.document, 'title')}</td>
                        <td>{draft._id}</td>

                        <td>url</td>
                        <td />
                      </Tr>
                    ))}
                  </tbody>
                </Drafts>
              </DraftsContainer>
            ) : (
              <div style={{marginTop: 25}}>
                <CircleSpinner />
              </div>
            )}

            {/*<Drafts>{this.state.drafs}</Drafts>*/}
          </RightCard>

          <LeftCard>
            <h2>Submit an Article</h2>
            <IconContainer onClick={() => this.createNewArticle()}>
              <Icon icon={'plus'} width={40} height={40} />
            </IconContainer>
            <Paragraph>Create your narrative bit by bit.</Paragraph>
            <List>
              <Bullet>
                <Element>
                  <IContainer>
                    <Icon
                      icon={'ethereum'}
                      width={15}
                      height={15}
                      color={__THIRD}
                    />
                  </IContainer>

                  <Text>Fully integrated with the Ethereum Blockchain</Text>
                </Element>
              </Bullet>

              <Bullet>
                <Element>
                  <IContainer>
                    <Icon
                      icon={'edit'}
                      width={13}
                      height={13}
                      color={__THIRD}
                    />
                  </IContainer>

                  <Text>Next-generation online editor</Text>
                </Element>
              </Bullet>

              <Bullet>
                <Element>
                  <IContainer>
                    <Icon
                      icon={'check'}
                      width={13}
                      height={13}
                      color={__THIRD}
                    />
                  </IContainer>

                  <Text>Fairly rewarded peer-review process</Text>
                </Element>
              </Bullet>
            </List>
          </LeftCard>
        </CardContainer>
      </Parent>
    );
  }
}

export default withRouter(MyArticles);
