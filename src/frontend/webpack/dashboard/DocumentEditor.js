import {EditorState} from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createSingleLinePlugin from 'draft-js-single-line-plugin';
import React, {Component} from 'react';
import styled from 'styled-components';
import {TopContainer} from './TopContainer.js';
import {getDomain} from '../../../helpers/getDomain.js';
import GridSpinner from '../../webpack/spinners/GridSpinner.js';
import Toolbar from './editor/Toolbar.js';
import {__GRAY_500} from '../../helpers/colors.js';
import {customStyleMap} from './editor/customStyleMap.js';
// import './editor/new-article.css';
import 'draft-js/dist/Draft.css';

const titleStyle = () => 'new-article-title';

const Parent = styled.div`
  display: flex;
  flex-direction: column;
`;
const Container = styled.div`
  transition: all 0.5s;
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0 20px;
`;
const EditorCard = styled.div`
  display: flex;
  flex-direction: column;
  word-wrap: break-word;
  border: 0.0625rem solid rgba(0, 0, 0, 0.05);
  border-radius: 0.25rem;
  background-color: #ffffff;
  background-clip: border-box;
  min-height: 420px;
  min-width: 80%;
  box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07) !important;
  margin-top: -130px !important;
`;

const Title = styled.h1`
  text-align: center;
  color: ${__GRAY_500};
`;

const EditorContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 1070px;
  margin: 0 auto;
`;

const TitleContainer = styled.div`
  font-size: 2em;
  color: inherit;
`;
class DocumentEditor extends Component {
  constructor() {
    super();
    this.state = {
      errorMessage: null,
      loading: false,
      editorState: EditorState.createEmpty()
    };

    this.onChange = editorState => this.setState({editorState});

    this.onTitleChange = title => {
      this.updateDocument({
        document: {
          ...this.state.document,
          title
        }
      });
    };
  }

  updateDocument() {
    const newDocument = {
      ...this.state.document
    };
    this.setState({
      document: newDocument
    });
  }

  onChange(editorState) {
    this.setState({editorState});
  }

  componentDidMount() {
    const draftId = this.props.match.params.id;
    this.setState({loading: true});
    fetch(`${getDomain()}/api/articles/drafts/${draftId}`, {
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

  renderTitle() {
    const singleLinePlugin = createSingleLinePlugin();
    return (
      <TitleContainer>

        <Editor
          plugins={[singleLinePlugin]}
          editorState={this.state.editorState}
          onChange={this.onChange}
          blockStyleFn={titleStyle}
          blockRenderMap={singleLinePlugin.blockRenderMap}
          placeholder="Please enter your title..."
          customStyleMap={customStyleMap}
        />
      </TitleContainer>
    );
  }

  render() {
    return (
      <div>
        {this.state.loading ? (
          <GridSpinner />
        ) : (
          <Parent>
            <TopContainer />
            <Container>
              <EditorCard>
                <Title>Write your article</Title>
                <Toolbar />
                <EditorContent>


                  <div>{this.renderTitle()}</div>
                </EditorContent>
              </EditorCard>
            </Container>
          </Parent>
        )}
      </div>
    );
  }
}

export default DocumentEditor;
