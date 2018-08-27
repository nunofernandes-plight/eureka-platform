import {find} from 'underscore';

const observationTypes = [];

class ObservationType {
	constructor(title, name, icon, hint) {
		this.title = title;
		this.name = name;
		this.icon = icon;
		this.hint = hint;
	}

	static get all() {
		return observationTypes;
	}

	static getFromCode(code) {
		return find(observationTypes, t => t.name === code);
	}
}

observationTypes.push(
	new ObservationType(
		'Standalone',
		'standalone',
		'standalone.png',
		'This paper is not a follow-up to another one or you don\'t want to add a link.'
	)
);
observationTypes.push(
	new ObservationType(
		'Follow-up',
		'followup',
		'followup.png',
		'This paper directly relates to another one. You will be asked to pick another published paper.'
	)
);

export default ObservationType;
