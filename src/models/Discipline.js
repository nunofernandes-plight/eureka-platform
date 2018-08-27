import {find} from 'underscore';
import {divisions} from '../helpers/theme';

const mattersDisciplines = [];
const hypothesisDisciplines = [];
const abstractDisciplines = [];

class Discipline {
	constructor(title, name, icon) {
		this.title = title;
		this.name = name;
		this.icon = icon;
	}

	static get all() {
		return [
			...mattersDisciplines,
			...hypothesisDisciplines,
			...abstractDisciplines
		];
	}

	static get observation() {
		return mattersDisciplines;
	}

	static get hypothesis() {
		return [...mattersDisciplines, ...hypothesisDisciplines];
	}

	static get abstract() {
		return [...abstractDisciplines];
	}

	static getForDivision(division) {
		if (divisions.hypothesismatters === division) {
			return Discipline.hypothesis;
		}
		if (divisions.humanitiesconnect === division) {
			return Discipline.abstract;
		}
		return Discipline.observation;
	}

	static getForType(type) {
		if (type === 'hypothesis') {
			return Discipline.hypothesis;
		}
		if (type === 'abstract') {
			return Discipline.abstract;
		}
		return Discipline.observation;
	}

	static getFromCode(code) {
		return find(Discipline.all, d => d.name === code);
	}
}

mattersDisciplines.push(new Discipline('Chemical', 'chemical', 'chemical.png'));
mattersDisciplines.push(new Discipline('Medical', 'medical', 'medical.png'));
mattersDisciplines.push(
	new Discipline('Biological', 'biological', 'biological.png')
);

hypothesisDisciplines.push(
	new Discipline('Agronomy', 'agronomy', 'agronomy.png')
);
hypothesisDisciplines.push(
	new Discipline('Earth and Space Sciences', 'earth_space')
);
hypothesisDisciplines.push(new Discipline('Economics', 'economics'));
hypothesisDisciplines.push(new Discipline('Engineering', 'engineering'));
hypothesisDisciplines.push(new Discipline('Mathematics', 'mathematics'));
hypothesisDisciplines.push(new Discipline('Physics', 'physics'));
hypothesisDisciplines.push(new Discipline('Psychology', 'psychology'));
hypothesisDisciplines.push(new Discipline('Sociology', 'sociology'));
hypothesisDisciplines.push(new Discipline('Other', 'other'));

abstractDisciplines.push(new Discipline('History', 'history'));
abstractDisciplines.push(
	new Discipline('History of Science', 'history-of-science')
);
abstractDisciplines.push(new Discipline('Art History', 'art-history'));

export default Discipline;
