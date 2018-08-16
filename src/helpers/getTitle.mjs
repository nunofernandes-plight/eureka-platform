/* eslint-disable complexity */
export default (field, type) => {
    if (field === 'title') {
        return 'Title';
    }
    if (field === 'authors') {
        return 'Authors';
    }
    if (field === 'main_discipline') {
        return 'Main discipline';
    }
    if (field === 'discipline') {
        return 'Sub Discipline';
    }
    if (field === 'keywords') {
        return 'Keywords';
    }
    if (field === 'metadata') {
        return 'Metadata';
    }
    if (field === 'observation_type') {
        return 'Observation Type';
    }
    if (field === 'abstract') {
        return 'Abstract';
    }
    if (field === 'limitations') {
        return 'Limitations';
    }
    if (field === 'conclusions') {
        return 'Conclusions';
    }
    if (field === 'link.observation_type') {
        return 'Observation Type';
    }
    if (field === 'link.nature') {
        return 'Nature';
    }
    if (field === 'alternative_explanations') {
        return 'Alternative Explanations';
    }
    if (field === 'conjectures') {
        return 'Conjectures';
    }
    if (field === 'introduction' && type === 'abstract') {
        return 'Introduction, Objective, Methods';
    }
    if (field === 'introduction') {
        return 'Introduction';
    }
    if (field === 'objective') {
        return 'Objective';
    }
    if (field === 'results_discussion' && type === 'abstract') {
        return 'Article';
    }
    if (field === 'results_discussion') {
        return 'Results & Discussion';
    }
    if (field === 'methods_easy') {
        return 'Methods';
    }
    if (field === 'funding_statement') {
        return 'Funding Statement';
    }
    if (field === 'acknowledgements') {
        return 'Acknowledgements';
    }
    if (field === 'ethics_statement') {
        return 'Ethics Statement';
    }
    if (field === 'citations') {
        return 'References';
    }
    if (field === 'references') {
        return 'References';
    }
    if (field === 'comments') {
        return 'Comments';
    }
    if (field === 'figure') {
        return 'Figure';
    }
    if (field === 'figure_text') {
        return 'Figure Legend';
    }
    if (field === 'hypothesis') {
        return 'Hypothesis';
    }
    if (field === 'no_coi') {
        return 'Conflict of interest';
    }
    if (field === 'proposed_evaluation_of_hypothesis') {
        return 'Proposed Evaluation of Hypothesis';
    }
    if (field === 'alternative_hypotheses') {
        return 'Alternative Hypotheses';
    }
    if (field === 'significance') {
        return 'Significance';
    }
    if (field === 'supportive_evidence_of_the_hypothesis') {
        return 'Supportive Evidence of the Hypothesis';
    }
    if (field === 'formalities') {
        return 'Formal requirements';
    }
    if (field === 'is_investigator_whom_funding_is_granted') {
        return 'Is investigator to whom funding was granted';
    }
    if (field === 'permission_of_investigator') {
        return 'Has permission of the investigator';
    }
    if (field === 'email_of_investigator') {
        return 'Email of investigator';
    }
};
