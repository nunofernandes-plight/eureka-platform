import React, {Component, Fragment} from 'react';
import styled from 'styled-components';
import {Route} from 'react-router';
import {Redirect, withRouter} from 'react-router-dom';
import MyDrafts from '../Articles/Online/MyDrafts.js';
import DocumentEditor from '../Articles/Online/TextEditor/DocumentEditor.js';
import NavPill from '../../views/NavPill.js';
import MySubmitted from '../Articles/MySubmitted.js';
import {ArticlesNavPillRoutes} from './ArticlesNavPillRoutes.js';
import {Card} from '../../views/Card.js';
import {DraftsRouter} from './DraftsRouter.js';

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
                  width={26}
                  height={26}
                />
              );
            })}
          </NavPills>
          <Route
            path={`${this.props.base}/drafts`}
            render={() => <DraftsRouter base={`${this.props.base}/drafts`} />}
          />

          <Route
            exact
            path={`${this.props.base}/submitted`}
            render={() => <MySubmitted base={`${this.props.base}/submitted`} />}
          />

          <Route
            exact
            path={`${this.props.base}/write/:id`}
            render={() => <DocumentEditor base={this.props.base} />}
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
