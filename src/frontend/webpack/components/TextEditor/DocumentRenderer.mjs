import draftJs from 'draft-js';
import Document from '../../../../models/Document.mjs';
import {deserializeDocument} from '../../../../helpers/documentSerializer.mjs';
const EditorState = draftJs.EditorState;
const convertToRaw = draftJs.convertToRaw;

export const renderField = (document, field) => {
  const deserialized = deserializeDocument(new Document(document));
  if (!document[field] || !(deserialized[field] instanceof EditorState)) {
    return 'cannot render';
  }

  switch (field) {
    case 'title':
      return renderTitle(deserialized, field);
    default:
      return 'default';
  }
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
