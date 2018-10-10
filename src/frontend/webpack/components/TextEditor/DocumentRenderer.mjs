import draftJs from 'draft-js';
import Document from '../../../../models/Document.mjs';
import {deserializeDocument} from '../../../../helpers/documentSerializer.mjs';
const EditorState = draftJs.EditorState;
const convertToRaw = draftJs.convertToRaw;

export const renderField = (document, field) => {
  const deserialized = deserializeDocument(new Document(document));

  if (Document.metaDataFields().includes(field)) {
    return renderMetaDataFields(deserialized, field);
  }

  switch (field) {
    case 'title':
      return renderTitle(deserialized, field);
    case 'authors':
      return renderAuthors(deserialized['authors']);
    default:
      return document[field];
  }
};

const renderMetaDataFields = (desarialized, field) => {
  const content = desarialized[field];
  if (Array.isArray(content)) {
    if (content.length === 0) {
      return '';
    }
  }
  return content;
};
const renderAuthors = authors => {
  let authorsString = '';
  authors.map(author => {
    authorsString += author + ', ';
  });

  return authorsString;
};
const renderTitle = (deserialized, field) => {
  // TODO: change the render with EditorState --> at the moment deserialize makes no sense
  const content = deserialized[field].getCurrentContent();
  const raw = convertToRaw(content);
  const firstBlock = raw.blocks[0];

  if (firstBlock.text.length === 0) {
    return 'Untitled document';
  }

  return firstBlock.text;
};
