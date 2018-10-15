import React from 'react';
import styled from 'styled-components';
import {fetchArticle} from '../TextEditor/DocumentMainMethods.js';
import Document from '../../../../models/Document.mjs';
import {deserializeDocument} from '../../../../helpers/documentSerializer.mjs';
import withRouter from 'react-router/es/withRouter.js';
import Modal from '../../design-components/Modal.js';
import {Card} from '../../views/Card.js';
import {Go} from '../Routers/Go.js';
import GridSpinner from '../../views/spinners/GridSpinner.js';
import {renderField} from '../TextEditor/DocumentRenderer.mjs';
import PreviewStatus from '../../views/PreviewStatus.js';
import {__GRAY_100, __GRAY_200, __GRAY_300} from '../../../helpers/colors.js';
import PreviewArticle from '../Preview/PreviewArticle.js';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
  width: 92%;
  margin-bottom: 2em;
  box-shadow: 0 0 0 0.75pt #d1d1d1, 0 0 3pt 0.75pt #ccc;
  padding: 5%;
  background: rgb(255, 255, 255);
`;

const ArticlePreview = styled.div`
  flex: 1;
`;

class ReviewsWriter extends React.Component {
  constructor() {
    super();
    this.state = {
      errorMessage: null
    };
  }

  componentDidMount() {
    const draftId = this.props.match.params.id;
    fetchArticle(draftId)
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          let document = new Document(response.data.document);
          let deserialized = deserializeDocument(document);
          this.setState({
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
        <Card title={'Write Your Review'} background={__GRAY_200}>
          <Go back {...this.props} />
          <MySeparator />
          {!this.state.document ? (
            <GridSpinner />
          ) : (
            <MyPreview>
              {' '}
              <ArticlePreview>
                <PreviewArticle
                  selectedAccount={this.props.selectedAccount}
                  documentId={this.props.match.params.id}
                  base={this.props.base}
                  document={this.state.document}
                />
              </ArticlePreview>
            </MyPreview>
          )}
        </Card>
      </Container>
    );
  }
}

export default withRouter(ReviewsWriter);
