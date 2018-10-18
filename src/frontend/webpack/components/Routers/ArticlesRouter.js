import React, {Component} from 'react';
import styled from 'styled-components';
import {Route} from 'react-router';
import {Redirect, withRouter} from 'react-router-dom';
import MyDrafts from '../MyDrafts.js';
import DocumentEditor from '../DocumentEditor.js';
import NavPill from '../../views/NavPill.js';
import MySubmitted from '../MySubmitted.js';
import {ArticlesNavPillRoutes} from './ArticlesNavPillRoutes.js';

const Parent = styled.div`
  display: flex;
  flex-direction: column;
`;

const NavPills = styled.div`
  display: flex;
  margin-bottom: 2em;
  justify-content: center;
`;

const Container = styled.div``;
class ArticlesRouter extends Component {
  constructor() {
    super();
    this.state = {
      currentPath: null
    };
  }

  componentDidMount() {
    this.changeActiveRoute();
  }

  changeActiveRoute() {
    const currentPath = this.props.location.pathname
      .toString()
      .replace(this.props.base.toString(), '')
      .replace(/[^a-zA-Z ]/g, '');
    this.setState({currentPath});
  }

  render() {
    return (
      <Parent>
        <Container>
          <NavPills>
            {ArticlesNavPillRoutes.map((item, index) => {
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
          <Route
            exact
            path={`${this.props.base}/drafts`}
            render={() => (
              <MyDrafts
                base={`${this.props.base}/drafts`}
                updateUser={() => {
                  this.props.updateUser();
                }}
              />
            )}
          />

          <Route
            exact
            path={`${this.props.base}/submitted`}
            render={() => (
              <MySubmitted
                base={`${this.props.base}/submitted`}
                network={this.props.network}
              />
            )}
          />

          <Route
            exact
            path={`${this.props.base}/drafts/:id`}
            render={props => (
              <DocumentEditor
                web3={this.props.web3}
                tokenContract={this.props.tokenContract}
                platformContract={this.props.platformContract}
                base={this.props.base}
                user={this.props.user}
                selectedAccount={this.props.selectedAccount}
                {...props}
              />
            )}
          />

          <Route
            exact
            path={`${this.props.base}`}
            render={() => <Redirect to={`${this.props.base}/drafts`} />}
          />
        </Container>
      </Parent>
    );
  }
}

export default withRouter(ArticlesRouter);
