import React, {Component} from 'react';
import styled from 'styled-components';
import {Route} from 'react-router';
import {NavLink, Redirect, withRouter} from 'react-router-dom';
import {Card} from '../../views/Card.js';
import {Go} from './Go.js';
import GridSpinner from '../../views/spinners/GridSpinner.js';
import {renderField} from '../Articles/Online/TextEditor/DocumentRenderer.mjs';
import PreviewStatus from '../../views/PreviewStatus.js';
import {
  __FIFTH,
  __GRAY_100,
  __GRAY_200,
  __GRAY_500
} from '../../../helpers/colors.js';
import {fetchArticle} from '../Articles/Online/TextEditor/DocumentMainMethods.js';
import Document from '../../../../models/Document.mjs';
import {deserializeDocument} from '../../../../helpers/documentSerializer.mjs';
import Modal from '../../design-components/Modal.js';
import PreviewAuthors from '../Preview/PreviewAuthors.js';
import PreviewMetaData from '../Preview/PreviewMetaData.js';
import PreviewArticle from '../Preview/PreviewArticle.js';

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const MySeparator = styled.div`
  height: 2px;
  display: flex;
  width: 75%;
  background: ${__GRAY_100};
  justify-content: center;
  margin-top: 25px;
`;

const MyPreview = styled.div`
  display: flex;
  padding: 20px;
  width: 100%;
`;

const ArticlePreview = styled.div`
  flex: 6.5 1 0;
`;

const Title = styled.h3`
  font-size: 26px;
  font-weight: bold;
  line-height: 1.3;
  font-family: 'Roboto', sans-serif;
  margin-bottom: 10px;
  margin-top: 0;
`;

const ArticlePreviewNavBar = styled.div`
  width: 100%;
  border-radius: 6px;
  margin: 22px 0;
  letter-spacing: 0.5px;
`;

const MyLabels = styled.div`
  display: flex;
`;
const Bar = styled.div`
  flex: 1;
  background: ${__GRAY_200};
  height: 4px;
  margin-top: 10px;
`;

const MyLink = styled(NavLink)`
  &:hover {
    transform: scaleX(1.03);
  }
  transition: 0.45s ease-in-out;
  text-decoration: none;
  flex: 1;
  font-size: 16px;
  color: ${__GRAY_500};
  margin-bottom: 10px;
  cursor: pointer;
  &.${props => props.activeClassName} {
    ${Bar} {
      transition: 0.45s ease-in-out;
      background: ${__FIFTH};
    }
    color: ${__FIFTH};
  }
`;

MyLink.defaultProps = {
  activeClassName: 'active'
};

class PreviewRouter extends Component {
  constructor() {
    super();
    this.state = {
      document: null,
      from: null
    };
  }

  componentDidMount() {
    this.setFromLocation();
    const draftId = this.props.match.params.id;
    fetchArticle(draftId)
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          let document = new Document(response.data.document);
          let deserialized = deserializeDocument(document);
          this.setState({
            _id: response.data._id,
            document: deserialized
          });
        } else {
          this.setState({
            errorMessage: response.error
          });
        }
        this.setState({loading: false});
      })
      .catch(err => {
        console.log(err);
        this.setState({
          errorMessage: 'Ouh. Something went wrong.',
          loading: false
        });
      });
  }

  setFromLocation() {
    const state = this.props.location.state;
    if (state) {
      const from = state.from;
      this.setState({from});
    }
  }

  renderModal() {
    return (
      <div>
        {' '}
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
      </div>
    );
  }
  render() {
    return (
      <Container>
        {this.renderModal()}
        <Card title={this.props.cardTitle}>
          <Go back {...this.props} from={this.state.from} />
          <MySeparator />
          {!this.state.document ? (
            <GridSpinner />
          ) : (
            <MyPreview>
              <PreviewMetaData document={this.state.document} />
              <ArticlePreview>
                <Title>{renderField(this.state.document, 'title')}</Title>
                <PreviewStatus status={this.state.document.state} />
                <ArticlePreviewNavBar>
                  <MyLabels>
                    <MyLink
                      to={`${this.props.base}/${
                        this.props.match.params.id
                      }/article`}
                    >
                      Article
                      <Bar />
                    </MyLink>
                    <MyLink
                      to={`${this.props.base}/${
                        this.props.match.params.id
                      }/authors`}
                    >
                      Authors
                      <Bar />
                    </MyLink>
                    <MyLink
                      to={`${this.props.base}/${
                        this.props.match.params.id
                      }/info`}
                    >
                      Info
                      <Bar />
                    </MyLink>
                  </MyLabels>
                </ArticlePreviewNavBar>

                <Route
                  exact
                  path={`${this.props.base}/${
                    this.props.match.params.id
                  }/article`}
                  render={() => (
                    <PreviewArticle document={this.state.document} />
                  )}
                />

                <Route
                  exact
                  path={`${this.props.base}/${
                    this.props.match.params.id
                  }/authors`}
                  render={() => (
                    <PreviewAuthors authors={this.state.document.authors} />
                  )}
                />

                <Route
                  exact
                  path={`${this.props.base}/${this.props.match.params.id}`}
                  render={() => (
                    <Redirect
                      to={`${this.props.base}/${
                        this.props.match.params.id
                      }/article`}
                    />
                  )}
                />
              </ArticlePreview>
            </MyPreview>
          )}
        </Card>
      </Container>
    );
  }
}

export default withRouter(PreviewRouter);
