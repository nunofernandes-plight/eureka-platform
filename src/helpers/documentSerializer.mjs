import draftjs from 'draft-js';
import lodash from 'lodash';
import Document from '../models/Document.mjs';

const convertToRaw = draftjs.convertToRaw;
const EditorState = draftjs.EditorState;
const convertFromRaw = draftjs.convertFromRaw;
const zipObject = lodash.zipObject;
const mapValues = lodash.mapValues;

export const serializeDocument = document => {
  const fields = document.getAllFields();
  const mapped = fields.map(field => {
    return convertFieldToJS(field, document[field]);
  });
  return Object.assign({}, document, zipObject(fields, mapped));
};

const fieldIsRaw = field => {
  return Document.textFields().indexOf(field) === -1;
};

export const convertFieldToJS = (field, js) => {
  if (fieldIsRaw(field)) {
    return js;
  }
  return convertToRaw(js.getCurrentContent());
};

const removeEmptyBlock = rawContentState => {
  if (rawContentState.blocks.length === 1) {
    return rawContentState;
  }
  // If there are two empty blocks, it might return empty array
  const filtered = Object.assign({}, rawContentState, {
    blocks: rawContentState.blocks.filter(b => b.text.trim().length > 0)
  });
  // In this case, just return the first block even though it is empty
  if (filtered.blocks.length === 0) {
    return Object.assign({}, rawContentState, {
      blocks: [rawContentState.blocks[0]]
    });
  }
  return filtered;
};

export const convertJSToField = (field = null, js) => {
  if (field && fieldIsRaw(field)) {
    return js;
  }
  if (js instanceof EditorState) {
    return js;
  }
  if (typeof js === 'string') {
    return js;
  }
  const noEmptyBlocks = removeEmptyBlock(js);
  const content = convertFromRaw(noEmptyBlocks);
  const state = EditorState.createWithContent(
    content,
    field === 'title' ? null : null // TODO: insert here decorator
  );
  return state;
};

export const deserializeDocument = document => {
  const fields = document.getAllFields();
  const mapped = fields.map(field => {
    if (document[field]) {
      if (document[field]['blocks'] && !document[field]['entityMap']) {
        document[field]['entityMap'] = {};
      }
    }
    return convertJSToField(field, document[field]);
  });
  const documentDeserialized = Object.assign(
    {},
    document,
    zipObject(fields, mapped)
  );
  return new Document(documentDeserialized);
};

export const serializeSavePatch = documentPatch => {
  return mapValues(documentPatch, (value, key) => convertFieldToJS(key, value));
};

export const deserializePatch = documentPatch => {
  return mapValues(documentPatch, (value, key) => convertJSToField(key, value));
};
