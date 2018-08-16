import lodash from 'lodash';
const filter = lodash.filter;
const find = lodash.find;
import Journal from '../models/journal.js';
import {isProduction} from './isProduction.mjs';

class Division {
  constructor(config) {
    Object.assign(this, config);
  }
}

export const divisions = {
  sciencematters: new Division({
    name: 'science',
    display_name: 'Science Matters',
    theme: 'sciencematters.css',
    material: 'material-science.css',
    favicon: 'favicon.ico',
    dev_port: '5050',
    prod_url: 'sciencematters.io',
    stage_url: 'multijournal.sciencematters.io',
    article_url: '/articles',
    logo: 'logos/matters white.png',
    logo_white: 'logos/matters fill.png',
    s3_logo: 'https://s3.amazonaws.com/sosjournals/logo.png',
    color: '#db3737',
    claim: "Stories can wait. Science can't.",
    publisher: 'ScienceMatters',
    company: 'ScienceMatters AG',
    featured_journals: [Journal.matters_select, Journal.matters],
    encompassing: [Journal.matters_select, Journal.matters, Journal.editorial]
  }),
  medicalmatters: new Division({
    name: 'medical',
    display_name: 'Medical Matters',
    theme: 'medicalmatters.css',
    material: 'material-medical.css',
    favicon: 'favicon-medical.png',
    dev_port: '5051',
    prod_url: 'medical.sciencematters.io',
    stage_url: 'medical.multijournal.sciencematters.io',
    article_url: '/articles?discipline=medical',
    logo: 'logos/medical white.png',
    logo_white: 'logos/medical fill.png',
    s3_logo: 'https://s3.amazonaws.com/sosjournals/logo.png',
    color: '#18816c',
    claim: "Stories can wait. Science can't.",
    publisher: 'ScienceMatters',
    company: 'ScienceMatters AG',
    featured_journals: [Journal.matters_select, Journal.matters],
    encompassing: [Journal.matters_select, Journal.matters]
  }),
  hypothesismatters: new Division({
    name: 'hypothesis',
    display_name: 'Hypothesis Matters',
    theme: 'hypothesismatters.css',
    material: 'material-hypothesis.css',
    favicon: 'favicon-hypothesis.png',
    dev_port: '5053',
    prod_url: 'hypothesis.sciencematters.io',
    stage_url: 'hypothesis.multijournal.sciencematters.io',
    article_url: '/articles?journal=hypothesis',
    logo: 'logos/hypothesis white.png',
    logo_white: 'logos/hypothesis fill.png',
    s3_logo: 'https://s3.amazonaws.com/sosjournals/logo-hypothesis.png',
    color: '#3d80c6',
    claim: 'It begins here.',
    publisher: 'ScienceMatters',
    company: 'ScienceMatters AG',
    featured_journals: [Journal.hypothesis],
    encompassing: [Journal.hypothesis]
  }),
  reproducibilitymatters: new Division({
    name: 'reproducibility',
    display_name: 'Matters of Reproducibility',
    theme: 'reproducibilitymatters.css',
    material: 'material-reproducibility.css',
    favicon: 'favicon-reproducibility.png',
    dev_port: '5054',
    prod_url: 'reproducibility.sciencematters.io',
    stage_url: 'reproducibility.multijournal.sciencematters.io',
    article_url: '/articles?journal=reproducibility',
    logo: 'logos/reproducibility white.png',
    logo_white: 'logos/reproducibility fill.png',
    s3_logo: 'https://s3.amazonaws.com/sosjournals/logo-reproducibility.png',
    color: '#f39c12',
    claim: "Stories can wait. Science can't",
    publisher: 'ScienceMatters',
    company: 'ScienceMatters AG',
    featured_journals: [Journal.reproducibility],
    encompassing: [Journal.reproducibility]
  }),
  humanitiesconnect: new Division({
    name: 'humanitiesconnect',
    display_name: 'HumanitiesConnect',
    theme: 'humanitiesconnect.css',
    material: 'material-humanities.css',
    favicon: 'favicon-medical.png',
    dev_port: '5055',
    prod_url: 'humanitiesconnect.sciencematters.io',
    stage_url: 'humanitiesconnect.multijournal.sciencematters.io',
    article_url: '/articles?journal=humanitiesconnect',
    logo: 'logos/humanitiesconnect.png', // TODO
    logo_white: 'logo/humanitiesconnect white.png',
    s3_logo: 'https://s3.amazonaws.com/sosjournals/logo.png',
    color: '#006c66',
    claim: 'Humanities Connect Tagline',
    publisher: 'HumanitiesConnect',
    company: 'HumanitiesConnect',
    featured_journals: [Journal.humanitiesconnect],
    encompassing: [Journal.humanitiesconnect]
  })
};

export const router = (request, response, next) => {
  response.locals.divisions = divisions;
  response.locals.dropdownDivisions = filter(
    divisions,
    d => d.name !== 'medical'
  );
  response.locals.division =
    find(divisions, division => {
      if (isProduction()) {
        if (
          request.hostname === division.prod_url ||
          request.hostname === division.stage_url
        ) {
          return division;
        }
      }
      if (request.get('host').indexOf(division.dev_port) > -1) {
        return division;
      }
      return null;
    }) || divisions.sciencematters;
  response.locals.multijournal = Boolean(process.env.MULTIJOURNAL);
  response.locals.stage = Boolean(process.env.STAGE);
  response.locals.newScoring = Boolean(process.env.NEW_SCORING);
  next();
};
