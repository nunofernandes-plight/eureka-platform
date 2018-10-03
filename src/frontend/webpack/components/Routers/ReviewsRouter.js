import React, {Component} from 'react';
import styled from 'styled-components';
import {Route} from 'react-router';
import {Redirect, withRouter} from 'react-router-dom';
import NavPill from '../../views/NavPill.js';
import EditorArticles from '../Editor/EditorArticles.js';
import EditorSignOff from '../Editor/EditorSignOff.js';
import Icon from '../../views/icons/Icon.js';
import {GoBack} from './GoBack.js';
import {GoForward} from './GoForward.js';
import EditorInvite from '../Editor/EditorInvite.js';
import {ReviewsNavPillRoutes} from './ReviewsNavPillRoutes.js';
import ReviewsInvited from '../Reviews/ReviewsInvited.js';
import {Card} from '../../views/Card.js';
import ReviewsOpen from '../Reviews/ReviewsOpen.js';

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

const NavPills = styled.div`
  display: flex;
  margin-bottom: 10px;
  justify-content: center;
`;

const MarginTop = styled.div`
  margin-top: 15px;
`;

const Container = styled.div``;
class ReviewsRouter extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {}

  render() {
    console.log(this.props);
    return (
      <Parent>
        <Container>
          <NavPills>
            {' '}
            <GoBack {...this.props} />
            {ReviewsNavPillRoutes.map((item, index) => {
              return (
                <NavPill
                  name={item.name}
                  base={this.props.base}
                  key={index}
                  path={item.path}
                  icon={item.icon}
                  material={item.material}
                  width={22}
                />
              );
            })}
            <GoForward {...this.props} />
          </NavPills>
          <CardContainer>
            <MarginTop>
              <Route
                exact
                path={`${this.props.base}/invited`}
                render={() => (
                  <ReviewsInvited
                    selectedAccount={this.props.selectedAccount}
                    platformContract={this.props.platformContract}
                    base={`${this.props.base}/invited`}
                    network={this.props.network}
                    web3={this.props.web3}
                  />
                )}
              />
            </MarginTop>

            <MarginTop>
              <Route
                exact
                path={`${this.props.base}/open`}
                render={() => (
                  <ReviewsOpen
                    selectedAccount={this.props.selectedAccount}
                    platformContract={this.props.platformContract}
                    base={`${this.props.base}/open`}
                    network={this.props.network}
                    web3={this.props.web3}
                  />
                )}
              />
            </MarginTop>

            <MarginTop>
              <Route
                exact
                path={`${this.props.base}/myreviews`}
                render={() => (
                  <ReviewsInvited
                    selectedAccount={this.props.selectedAccount}
                    platformContract={this.props.platformContract}
                    base={`${this.props.base}/myreviews`}
                    network={this.props.network}
                    web3={this.props.web3}
                  />
                )}
              />
            </MarginTop>

            <Route
              exact
              path={`${this.props.base}`}
              render={() => <Redirect to={`${this.props.base}/invited`} />}
            />
          </CardContainer>
        </Container>
      </Parent>
    );
  }
}

export default withRouter(ReviewsRouter);
