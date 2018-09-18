import React, {Component} from 'react';
import styled from 'styled-components';
import {Route} from 'react-router';
import {Redirect, withRouter} from 'react-router-dom';
import NavPill from '../../views/NavPill.js';
import {EditorNavPillRoutes} from './EditorNavPillRoutes.js';
import EditorArticles from '../Editor/EditorArticles.js';
import EditorSignOff from '../Editor/EditorSignOff.js';
import Icon from '../../views/icons/Icon.js';
import {GoBack} from './GoBack.js';
import {GoForward} from './GoForward.js';

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
            {' '}
            <GoBack {...this.props} />
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
            <GoForward {...this.props} />
          </NavPills>
          <CardContainer>
            <MarginTop>
              <Route
                exact
                path={`${this.props.base}/articles`}
                render={() => (
                  <EditorArticles
                    selectedAccount={this.props.selectedAccount}
                    platformContract={this.props.platformContract}
                    base={`${this.props.base}/articles`}
                    network={this.props.network}
                  />
                )}
              />
            </MarginTop>

            <MarginTop>
              <Route
                exact
                path={`${this.props.base}/signoff`}
                render={() => (
                  <EditorSignOff
                    selectedAccount={this.props.selectedAccount}
                    platformContract={this.props.platformContract}
                    base={`${this.props.base}/signoff`}
                    network={this.props.network}
                  />
                )}
              />
            </MarginTop>
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
