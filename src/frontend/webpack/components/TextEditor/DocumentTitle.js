import React from 'react';
import styled from 'styled-components';
import Editor from 'draft-js-plugins-editor';
import TitleWithHelper from './TitleWithHelper.js';
import {customStyleMap} from '../../../helpers/customStyleMap.js';
import createSingleLinePlugin from 'draft-js-single-line-plugin';
const titleStyle = () => 'title';

const TitleContainer = styled.div`
  color: inherit;
`;
class DocumentTitle extends React.Component {
  render() {
    const singleLinePlugin = createSingleLinePlugin();
    return (
      <TitleContainer className="title">
        <TitleWithHelper
          field="title"
          requirement={{required: true, hint: 'this is a test rqureiaijsfijas'}}
          document={{title: 'test'}}
          title="Title"
          id="title"
        />
        <Editor
          plugins={[singleLinePlugin]}
          editorState={this.props.document.title}
          onChange={this.props.onTitleChange.bind(this)}
          blockStyleFn={titleStyle}
          blockRenderMap={singleLinePlugin.blockRenderMap}
          placeholder="Please enter your title..."
          customStyleMap={customStyleMap}
        />
      </TitleContainer>
    );
  }
}

export default DocumentTitle;
