import {Modifier, EditorState, RichUtils} from 'draft-js';

const toggleInlineStyle = (
	editorState,
	styleToToggle,
	incompatibilites = [[]]
) => {
	const selection = editorState.getSelection();
	const content = editorState.getCurrentContent();
	let nextContent;
	for (const incompatibleStyles of incompatibilites) {
		nextContent = incompatibleStyles.reduce((state, style) => {
			if (style === styleToToggle) {
				return state;
			}
			return Modifier.removeInlineStyle(state, selection, style);
		}, content);
	}
	const nextEditorState = EditorState.push(
		editorState,
		nextContent,
		'change-inline-style'
	);
	return RichUtils.toggleInlineStyle(nextEditorState, styleToToggle);
};

export const removeInlineStyle = (editorState, inlineStyles) => {
	const selection = editorState.getSelection();
	const nextContentState = inlineStyles.reduce((contentState, style) => {
		return Modifier.removeInlineStyle(contentState, selection, style);
	}, editorState.getCurrentContent());

	return EditorState.push(editorState, nextContentState, 'change-inline-style');
};

export default toggleInlineStyle;
