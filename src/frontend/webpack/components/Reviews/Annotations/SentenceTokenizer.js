import tokenizer from 'sbd';

export const tokenizeSentence = paragraph => {
  const optional_options = {};
  return tokenizer.sentences(paragraph, optional_options);
};
