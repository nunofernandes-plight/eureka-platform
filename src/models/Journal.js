import lodash from 'lodash';

const uniqBy = lodash.unionBy;

class Journal {
	static get matters_select() {
		return {
			name: 'Matters Select',
			code: 'matters_select',
			color: '#db3737',
			description:
                'A journal for outstanding single-observations by ScienceMatters',
			ISSN: '2297-9239',
			link: 'https://sciencematters.io/articles?journal=matters_select'
		};
	}

	static get matters() {
		return {
			name: 'Matters',
			code: 'matters',
			color: '#ff4081',
			description: 'A journal for single-observations by ScienceMatters',
			ISSN: '2297-8240',
			link: 'https://sciencematters.io/articles?journal=matters'
		};
	}

	static get hypothesis() {
		return {
			name: 'Hypothesis Matters',
			code: 'hypothesis',
			color: '#3d80c6',
			description: 'A journal for hypotheses by ScienceMatters',
			ISSN: 'will be issued after 5 articles are published'
		};
	}

	static get reproducibility() {
		return {
			name: 'Matters of Reproducibility',
			code: 'reproducibility',
			color: '#f39c12',
			ISSN: 'will be issued after 5 articles are published',
			description: 'A journal for replications by ScienceMatters'
		};
	}

	static get humanitiesconnect() {
		return {
			name: 'HumanitiesConnect',
			code: 'humanitiesconnect',
			color: '#006c66',
			ISSN: 'will be issued after 5 article are published',
			description: 'TBD' // TODO
		};
	}

	static get matters_archive() {
		return {
			name: 'Matters Archive',
			code: 'matters_archive',
			color: '#db3737',
			description: 'An archive of single-observations by ScienceMatters',
			ISSN: '2297-9247'
		};
	}

	static get editorial() {
		return {
			name: 'Editorial',
			code: 'editorial',
			color: '#000000',
			description: 'ScienceMatters\' editorial journal',
			ISSN: '2297-8240'
		};
	}

	static get no_journal() {
		return {
			name: 'No journal selected',
			description:
                'This is a dummy journal which you should only see as an admin.'
		};
	}

	static getAll() {
		return [
			this.matters_select,
			this.matters,
			this.editorial,
			this.matters_archive,
			this.hypothesis,
			this.reproducibility,
			this.humanitiesconnect
		];
	}

	static getActive() {
		if (process.env.HUMANITIES) {
			return [this.humanitiesconnect];
		}
		const active = [this.matters_select, this.matters, this.editorial];
		if (process.env.MULTIJOURNAL) {
			if (process.env.HYPOTHESIS) {
				active.push(this.hypothesis);
			}
			if (process.env.REPRODUCIBILITY) {
				active.push(this.reproducibility);
			}
		}
		return active;
	}

	static getActiveWithFeaturedOnTop(theme) {
		return uniqBy(
			[...theme.featured_journals, ...Journal.getActive()],
			j => j.name
		);
	}

	static getForCode(code) {
		return Journal.getAll().find(j => j.code === code) || Journal.no_journal;
	}
}

export default Journal;
