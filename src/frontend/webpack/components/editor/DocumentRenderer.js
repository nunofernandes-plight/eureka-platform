import {EditorState, convertToRaw} from 'draft-js';
import Document from '../../../../models/Document.mjs';
import {deserializeDocument} from '../../../../helpers/documentSerializer.mjs';

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
	const maxLenght = 30;
	// TODO: change the render with EditorState --> at the moment deserialize makes no sense
	const content = deserialized[field].getCurrentContent();
	const raw = convertToRaw(content);
	const firstBlock = raw.blocks[0];

	if (firstBlock.text.length === 0) {
		return 'Untitled document';
	}

	return firstBlock.text.length > maxLenght ?
		firstBlock.text.substring(0, maxLenght - 1) + ' ...' :
		firstBlock.text;
};
