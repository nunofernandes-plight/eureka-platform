import React, {Component} from 'react';
import styled from 'styled-components';
import {Route} from 'react-router';
import {Redirect, withRouter} from 'react-router-dom';
import NavPill from '../../views/NavPill.js';
import {EditorNavPillRoutes} from './EditorNavPillRoutes.js';
import EditorArticles from '../Editor/EditorArticles.js';
import EditorSignOff from '../Editor/EditorSignOff.js';
import EditorInvite from '../Editor/EditorInvite.js';
import EditorCheckReviews from '../Editor/EditorCheckReviews.js';
import EditorFinalize from '../Editor/EditorFinalize.js';

const Parent = styled.div`
  display: flex;
  flex-direction: column;
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 2em;
`;

const NavPills = styled.div`
  display: flex;
  justify-content: center;
`;

const Container = styled.div``;
class EditorRouter extends Component {
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
            {EditorNavPillRoutes.map((item, index) => {
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
              path={`${this.props.base}/articles`}
              render={() => (
                <EditorArticles
                  selectedAccount={this.props.selectedAccount}
                  base={`${this.props.base}/articles`}
                />
              )}
            />
            <Route
              exact
              path={`${this.props.base}/signoff`}
              render={() => (
                <EditorSignOff
                  selectedAccount={this.props.selectedAccount}
                  base={`${this.props.base}/signoff`}
                />
              )}
            />
            <Route
              exact
              path={`${this.props.base}/invite`}
              render={() => (
                <EditorInvite
                  selectedAccount={this.props.selectedAccount}
                  base={`${this.props.base}/invite`}
                />
              )}
            />
            <Route
              exact
              path={`${this.props.base}/reviews`}
              render={() => (
                <EditorCheckReviews
                  selectedAccount={this.props.selectedAccount}
                  base={`${this.props.base}/reviews`}
                />
              )}
            />
            <Route
              exact
              path={`${this.props.base}/finalize`}
              render={() => (
                <EditorFinalize
                  selectedAccount={this.props.selectedAccount}
                  base={`${this.props.base}/finalize`}
                />
              )}
            />
            <Route
              exact
              path={`${this.props.base}`}
              render={() => <Redirect to={`${this.props.base}/articles`} />}
            />
          </CardContainer>
        </Container>
      </Parent>
    );
  }
}

export default withRouter(EditorRouter);
