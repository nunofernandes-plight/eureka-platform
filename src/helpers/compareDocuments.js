import draftjs from 'draft-js';
import lodash from 'lodash';
const isEqual = lodash.isEqual;
const EditorState = draftjs.EditorState;


const isEditorState = thing => {
    return thing instanceof EditorState;
};

const getBlockMap = (document, key) => {
    return document[key].getCurrentContent().getBlockMap();
};

const getEntityMap = (document, key) => {
    return document[key].getCurrentContent().getEntityMap();
};

const getChangedFields = (document1, document2) => {
    const keys = Object.keys(document1);
    return keys
        .map(key => {
            if (isEditorState(document1[key])) {
                return [
                    key,
                    getBlockMap(document1, key).equals(getBlockMap(document2, key)) &&
                    isEqual(getEntityMap(document1, key), getEntityMap(document2, key))
                ];
            }
            return [key, isEqual(document1[key], document2[key])];
        })
        .filter(k => !k[1])
        .map(k => k[0]);
};

export default getChangedFields;
