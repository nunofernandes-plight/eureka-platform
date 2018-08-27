let modifier = 'Ctrl+';

if (
	typeof window !== 'undefined' &&
    window.navigator.platform.indexOf('Mac') > -1
) {
	modifier = '⌘';
}

const finalModifier = modifier;

export default finalModifier;
