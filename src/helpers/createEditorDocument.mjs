import draftjs from 'draft-js';

const EditorState = draftjs.EditorState;
import Document from '../models/Document.mjs';
import {convertFieldToJS} from '../helpers/documentSerializer.mjs';

const getFieldValue = field => {
  switch (field) {
    case 'title':
      return EditorState.createEmpty();
    case 'authors':
      return [];
    case 'metadata':
      return null;
    case 'accepts_ethic':
      return false;
    case 'figure':
      return Object.assign({}, Document.create().figure);
    default:
      // TODO insert decorator in createEmpty Strategy
      return EditorState.createEmpty();
  }
};

const createNewEmpty = () => {
  let document = new Document();
  document.new_format = true;
  const allUniqueFields = document.getAllFields();
  for (let field of allUniqueFields) {
    document[field] = getFieldValue(field);
  }
  return document;
};

export const addNewFields = document => {
  // Add new fields that were later added and maintain backwards compatibility
  const allUniqueFields = new Document().getAllFields();
  for (let field of allUniqueFields) {
    if (!document[field]) {
      document[field] = getFieldValue(field);
      if (document[field] instanceof EditorState) {
        document[field] = convertFieldToJS(field, document[field]);
      }
    }
  }
  return document;
};

export default createNewEmpty;
