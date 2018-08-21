import React, {Component} from 'react';
import styled from 'styled-components';
import {Route} from 'react-router';
import {Redirect, Link} from 'react-router-dom';
import MyDrafts from './MyDrafts.js';
import DocumentEditor from './DocumentEditor.js';
import NavPill from '../views/NavPill.js';
import MySubmitted from './MySubmitted.js';
import {__THIRD} from '../../helpers/colors.js';
import {NavPillRoutes} from './routers/NavPillRoutes.js';

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

const MyLink = styled(Link)`
  transition: 0.25s all;
  text-decoration: none;
`;

const Container = styled.div``;
class MyArticles extends Component {
  constructor() {
    super();
  }

  componentDidMount() {}

  render() {
    return (
      <Parent>
        <Container>
          <NavPills>
            {NavPillRoutes.map((item, index) => {
              return (
                <MyLink to={`${this.props.base}/${item.path}`}>
                  <NavPill
                    status={'active'}
                    icon={item.icon}
                    width={22}
                    material={item.material}
                  />
                </MyLink>
              );
            })}
          </NavPills>
          <CardContainer>
            <MarginTop>
              <Route
                exact
                path={`${this.props.base}/drafts`}
                render={() => <MyDrafts base={`${this.props.base}/drafts`} />}
              />
            </MarginTop>

            <MarginTop>
              <Route
                exact
                path={`${this.props.base}/submitted`}
                render={() => (
                  <MySubmitted base={`${this.props.base}/submitted`} />
                )}
              />
            </MarginTop>

            <Route
              exact
              path={`${this.props.base}/drafts/:id`}
              render={props => (
                <DocumentEditor
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
          </CardContainer>
        </Container>
      </Parent>
    );
  }
}

export default MyArticles;
