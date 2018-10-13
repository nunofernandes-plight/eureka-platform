import React, {Component} from 'react';
import styled from 'styled-components';
import {Route} from 'react-router';
import {Redirect, withRouter} from 'react-router-dom';
import NavPill from '../../views/NavPill.js';
import {ReviewsNavPillRoutes} from './ReviewsNavPillRoutes.js';
import ReviewsInvited from '../Reviews/ReviewsInvited.js';
import ReviewsOpen from '../Reviews/ReviewsOpen.js';
import Roles from '../../../../backend/schema/roles-enum.mjs';
import BecomeReviewer from '../Reviews/BecomeReviewer.js';
import ReviewsMyReviews from '../Reviews/ReviewsMyReviews.js';
import PreviewRouter from './PreviewRouter.js';

const Parent = styled.div`
  display: flex;
  flex-direction: column;
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

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
`;

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
        {this.props.user.roles.includes(Roles.REVIEWER) ? (
          <Container>
            <NavPills>
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
            </NavPills>
            <CardContainer>
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

              <Route
                exact
                path={`${this.props.base}/myreviews`}
                render={() => (
                  <ReviewsMyReviews
                    selectedAccount={this.props.selectedAccount}
                    platformContract={this.props.platformContract}
                    base={`${this.props.base}/myreviews`}
                    network={this.props.network}
                    web3={this.props.web3}
                  />
                )}
              />

              <Route
                exact
                path={`${this.props.base}`}
                render={() => {
                  return <Redirect to={`${this.props.base}/invited`} />;
                }}
              />
            </CardContainer>
          </Container>
        ) : (
          <BecomeReviewer
            user={this.props.user}
            updateUser={() => {
              this.props.updateUser();
            }}
          />
        )}
      </Parent>
    );
  }
}

export default withRouter(ReviewsRouter);
