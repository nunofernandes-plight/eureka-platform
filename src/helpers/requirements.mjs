import {isEmail} from './validator.mjs';
import Requirement from '../models/Requirement.mjs';

export const hypothesisRequirements = {
  title: new Requirement({
    required: true
  }),
  main_discipline: new Requirement({
    required: true,
    array: true,
    hint:
      'Select the main area of your paper. You can select multiple disciplines, put those that apply the most first.'
  }),
  discipline: new Requirement({
    required: true,
    array: true,
    minCharacters: 1,
    maxCharacters: 3,
    hint:
      'Select the disciplines that apply. You can also type disciplines on your own.'
  }),
  keywords: new Requirement({
    required: true,
    array: true,
    minCharacters: 2,
    maxCharacters: 5,
    hint: 'Select keywords or type your own.'
  }),
  'link.observation_type': new Requirement({
    required: true,
    hint:
      'Select whether this is an extension of another hypothesis or just a standalone hypothesis. You will be able to cite another hypothesis if you select "Follow-up".'
  }),
  'link.nature': new Requirement({
    required: false
  }),
  abstract: new Requirement({
    required: true,
    minCharacters: 100
  }),
  figure_text: new Requirement({
    required: false
  }),
  introduction: new Requirement({
    required: true
  }),
  hypothesis: new Requirement({
    required: true
  }),
  supportive_evidence_of_the_hypothesis: new Requirement({
    required: true
  }),
  proposed_evaluation_of_hypothesis: new Requirement({
    required: true
  }),
  alternative_explanations: new Requirement({
    required: false
  }),
  significance: new Requirement({
    required: true,
    hint: 'Implications if the hypothesis is correct or incorrect...'
  }),
  conclusions: new Requirement({
    required: true
  }),
  funding_statement: new Requirement({
    required: false,
    hint:
      'Please acknowledge all the funding sources (if possible with the official number of the grant)',
    blinded: true
  }),
  acknowledgements: new Requirement({
    required: false,
    blinded: true
  }),
  methods_easy: new Requirement({
    required: false
  }),
  ethics_statement: new Requirement({
    required: false,
    blinded: true
  }),
  is_investigator_whom_funding_is_granted: new Requirement({
    required: true,
    fulfilled: document => {
      return (
        typeof document.is_investigator_whom_funding_is_granted === 'boolean'
      );
    }
  }),
  permission_of_investigator: new Requirement({
    required: true,
    fulfilled: document => {
      return (
        document.is_investigator_whom_funding_is_granted ||
        document.has_permission_of_the_investigator
      );
    }
  }),
  email_of_investigator: new Requirement({
    required: true,
    fulfilled: document => {
      return (
        document.is_investigator_whom_funding_is_granted ||
        (document.has_permission_of_the_investigator &&
          isEmail(document.email_of_investigator))
      );
    }
  }),
  no_coi: new Requirement({
    required: true,
    fulfilled: document => {
      return typeof document.no_coi === 'boolean';
    }
  })
};

export const abstractRequirements = {
  title: new Requirement({
    required: true
  }),
  abstract: new Requirement({
    required: false
  }),
  figure_text: new Requirement({
    required: false
  }),
  is_investigator_whom_funding_is_granted:
  hypothesisRequirements.is_investigator_whom_funding_is_granted,
  permission_of_investigator: hypothesisRequirements.permission_of_investigator,
  email_of_investigator: hypothesisRequirements.email_of_investigator,
  no_coi: hypothesisRequirements.no_coi,
  main_discipline: new Requirement({
    required: true,
    array: true,
    minCharacters: 1,
    hint:
      'Select the main area of your paper. You can select multiple disciplines, put those that apply the most first.'
  }),
  discipline: new Requirement({
    required: true,
    array: true,
    minCharacters: 1
  }),
  keywords: new Requirement({
    required: false,
    array: true,
    minCharacters: 0
  }),
  acknowledgements: new Requirement({
    required: false,
    blinded: true,
    hint:
      'Please only acknowledge the most relevant people for reagent sharing, thoughtful discussions, etc.'
  }),
  ethics_statement: new Requirement({
    required: true,
    blinded: true,
    hint:
      'Please write the ethics committee declaration and that all the studies involving human subjects, animals, genetically modified organisms, genetically modified cells are according to ethics committee approval. Please refer to the official documentation number. If your study doesn\'t require ethics declaration, please write \'Not Applicable\'.'
  }),
  results_discussion: new Requirement({
    required: true,
    hint: 'Ideally less than 1000 words, if possible'
  })
};

export const mattersRequirements = Object.assign({},
  abstractRequirements, {
    main_discipline: new Requirement({
      required: true,
      array: true,
      minCharacters: 1,
      hint:
        'Select the main area of your paper. You can select multiple disciplines, put those that apply the most first.'
    }),
    discipline: new Requirement({
      required: true,
      array: true,
      maxCharacters: 3,
      hint:
        'Select the disciplines that apply. You can also type disciplines on your own.'
    }),
    keywords: new Requirement({
      required: true,
      array: true,
      minCharacters: 2,
      maxCharacters: 5,
      hint: 'Select keywords or type your own.'
    }),
    'link.observation_type': new Requirement({
      required: true,
      hint:
        'Select whether this is an extension of another observation or just a standalone observation. You will be able to cite another observation if you select "Follow-up".'
    }),
    'link.nature': new Requirement({
      required: true,
      hint: 'Select the entry that fits the most.'
    }),
    introduction: new Requirement({
      required: true
    }),
    objective: new Requirement({
      required: true
    }),
    results_discussion: new Requirement({
      required: true
    }),
    conclusions: new Requirement({
      required: false,
      maxCharacters: 2500
    }),
    limitations: new Requirement({
      required: false,
      maxCharacters: 2500,
      hint:
        'Please spell out the limitations of your study (e.g., cell culture experiment which needs to be validated in animal model, inhibitor could have possible side effects, small cohort study, etc).'
    }),
    alternative_explanations: new Requirement({
      required: false,
      maxCharacters: 2500,
      hint:
        'Please spell out if you think your results could also be interpreted differently.'
    }),
    conjectures: new Requirement({
      required: false,
      maxCharacters: 2500,
      hint:
        'What, in your opinion, are the following steps? What do you think your study implies and how do you want to continue?'
    }),
    funding_statement: new Requirement({
      required: false,
      blinded: true,
      maxCharacters: 2500,
      hint:
        'Please acknowledge all the funding sources (if possible with the official number of the grant).'
    }),
    acknowledgements: new Requirement({
      required: false,
      blinded: true,
      hint:
        'Please only acknowledge the most relevant people for reagent sharing, thoughtful discussions, etc.'
    }),
    ethics_statement: new Requirement({
      required: true,
      blinded: true,
      hint:
        'Please write the ethics committee declaration and that all the studies involving human subjects, animals, genetically modified organisms, genetically modified cells are according to ethics committee approval. Please refer to the official documentation number. If your study doesn\'t require ethics declaration, please write \'Not Applicable\'.'
    }),
    methods_easy: new Requirement({
      required: true,
      hint: 'Please write down all the methods used.'
    })
  });

export const reproducibilityRequirements = Object.assign(
  {},
  mattersRequirements,
  {
    'link.observation_type': new Requirement({
      required: false
    })
  }
);
