import _ from 'underscore';
import {DRAFT} from './ArticleStates.mjs';
import {DEFAULT_NUMBER_OF_ROUNDS} from './StateMachine.mjs';
import {options as documentTypes} from '../helpers/documentTypes.mjs';
import {
  hypothesisRequirements,
  mattersRequirements,
  reproducibilityRequirements,
  abstractRequirements
} from '../helpers/requirements.mjs';
class Document {
  constructor(obj) {
    Object.assign(this, Document.create());
    Object.assign(this, obj);
  }

  static get types() {
    return {
      observation: 'observation',
      editorial: 'editorial',
      hypothesis: 'hypothesis',
      replication: 'replication',
      abstract: 'abstract'
    };
  }
  static editableFields() {
    return [
      ...Document.revisionFields(),
      'email_of_investigator',
      'link',
      'correspondence',
      'figure_text',
      'accepts_ethic',
      'is_investigator_whom_funding_is_granted',
      'has_permission_of_the_investigator',
      'no_coi',
      'website',
      'external_reference',
      'keywords',
      'discipline',
      'citations',
      'methods_easy_sharing',
      'supplementary_information',
      'raw_data',
      'main_discipline',
      'other_discipline',
      'authors',
      'methods_easy',
      'comments',
      'title',
      'type'
    ];
  }
  static textFields() {
    return [
      'abstract',
      'introduction',
      'hypothesis',
      'proposed_evaluation_of_hypothesis',
      'supportive_evidence_of_the_hypothesis',
      'alternative_hypotheses',
      'significance',
      'objective',
      'results_discussion',
      'conclusions',
      'methods_easy',
      'alternative_explanations',
      'funding_statement',
      'acknowledgements',
      'ethics_statement',
      'figure_text',
      'limitations',
      'conjectures',
      'title'
    ];
  }
  static revisionFields() {
    return [
      'abstract',
      'figures',
      'introduction',
      'objective',
      'results_discussion',
      'conclusions',
      'limitations',
      'hypothesis',
      'proposed_evaluation_of_hypothesis',
      'supportive_evidence_of_the_hypothesis',
      'alternative_hypotheses',
      'significance',
      'conjectures',
      'methods_easy',
      'references',
      'alternative_explanations',
      'funding_statement',
      'acknowledgements',
      'ethics_statement',
      'metadata',
      'comments'
    ];
  }
  static fieldsToKeepUponRejection() {
    return _.without(
      [
        ...this.initialFields(),
        'ghostwriter',
        'handling_editor',
        'rejected_editors',
        'removed_reviewers',
        'reviewers',
        'payment_method'
      ],
      'state_transitions'
    );
  }
  static initialFields() {
    return Object.keys(this.create());
  }

  static create() {
    return {
      title: '',
      authors: [],
      correspondence: [],
      abstract: '',
      figure_text: '',
      website: '',
      hypothesis: '',
      proposed_evaluation_of_hypothesis: '',
      alternative_hypotheses: '',
      supportive_evidence_of_the_hypothesis: '',
      significance: '',
      figures: [],
      introduction: '',
      objective: '',
      results_discussion: '',
      conclusions: '',
      limitations: '',
      conjectures: '',
      funding_statement: '',
      acknowledgements: '',
      ethics_statement: '',
      keywords: [],
      supplementary_information: [],
      raw_data: {},
      citations: {},
      comments: {},
      reviews_needed: Document.reviewsNeeded(),
      accepts_ethic: false,
      alternative_explanations: '',
      is_investigator_whom_funding_is_granted: null,
      has_permission_of_the_investigator: false,
      email_of_investigator: null,
      link: {
        observation_type: null,
        isOriginalAuthor: null,
        nature: null,
        reference: []
      },
      discipline: [],
      main_discipline: [],
      methods_easy: '',
      methods_easy_sharing: false,
      other_discipline: '',
      external_reference: null,
      no_coi: null,
      state: DRAFT,
      depth: 0,
      number_of_rounds: DEFAULT_NUMBER_OF_ROUNDS,
      type: this.types.observation,
      state_transitions: [],
      created_at: Date.now(),
      coi_declaration: ''
    };
  }
  getAllFields() {
    const document = new Document();
    const allFields = documentTypes.map(d => {
      return document.getFormat(d.value);
    });
    return _.uniq(_.flatten(allFields));
  }

  getFormat(type = this.type) {
    if (type === 'hypothesis') {
      return [
        'accepts_ethic',
        'title',
        'authors',
        'metadata',
        'abstract',
        'figures',
        'figure_text',
        'introduction',
        'hypothesis',
        'supportive_evidence_of_the_hypothesis',
        'proposed_evaluation_of_hypothesis',
        'alternative_hypotheses',
        'significance',
        'conclusions',
        'funding_statement',
        'acknowledgements',
        'methods_easy',
        'ethics_statement'
      ];
    }
    if (type === 'abstract') {
      return [
        'title',
        'authors',
        'metadata',
        'abstract',
        'introduction',
        'figures',
        'figure_text',
        'results_discussion',
        'funding_statement',
        'acknowledgements',
        'ethics_statement'
      ];
    }
    return [
      'accepts_ethic',
      'title',
      'authors',
      'metadata',
      'abstract',
      'figures',
      'figure_text',
      'introduction',
      'objective',
      'results_discussion',
      'conclusions',
      'limitations',
      'alternative_explanations',
      'conjectures',
      'funding_statement',
      'acknowledgements',
      'ethics_statement',
      'methods_easy'
    ];
  }
  getTextRequirements(type = this.type) {
    if (type === 'hypothesis') {
      return hypothesisRequirements;
    }
    if (type === 'replication') {
      return reproducibilityRequirements;
    }
    if (type === 'abstract') {
      return abstractRequirements;
    }
    return mattersRequirements;
  }

  static reviewsNeeded(document) {
    if (document && _.isNumber(document.reviews_needed)) {
      return document.reviews_needed;
    }
    return 2;
  }
  reviewsNeeded() {
    return Document.reviewsNeeded(this);
  }
  static isEditorial(document) {
    return document.type === this.types.editorial;
  }
  static isObservation(document) {
    return document.type === this.types.observation;
  }
  static visibleFields() {
    return [...Document.editableFields(), 'manuscript_number'];
  }
}

export default Document;
