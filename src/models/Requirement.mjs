import underscore from 'underscore';
import lodash from 'lodash';
import slugify from 'slugify';
import getTitle from '../helpers/getTitle.mjs';
import SubmitError from './SubmitErrors.mjs';
const property = lodash.property;
const isArray = underscore.isArray;
const isString = underscore.isString;

class Requirement {
  constructor(
    {
      required = false,
      hint = null,
      blinded = false,
      maxCharacters = null,
      minCharacters = null,
      array = false,
      fulfilled = null
    } = {}
  ) {
    this.required = required;
    this.hint = hint;
    this.blinded = blinded;
    this.maxCharacters = maxCharacters;
    this.minCharacters = minCharacters;
    this.array = array;
    this.fulfilled = fulfilled;
  }
  getArrayErrors(document, field) {
    const array = property(field)(document);
    if (!isArray(array)) {
      return [
        new SubmitError({
          link: '#' + field,
          label: `The field "${getTitle(
            field,
            document.type
          )}" is not an array.`
        })
      ];
    }
    if (this.required && array.length === 0) {
      return [
        new SubmitError({
          link: '#' + field,
          label: `The field "${getTitle(
            field,
            document.type
          )}" is mandatory, but empty.`
        })
      ];
    }
    if (this.maxCharacters && array.length > this.maxCharacters) {
      return [
        new SubmitError({
          link: '#' + field,
          label: `The field "${getTitle(
            field,
            document.type
          )}" has a limit of ${this.maxCharacters} items, but you have ${
            array.length
          }.`
        })
      ];
    }
    if (this.minCharacters && array.length < this.minCharacters) {
      return [
        new SubmitError({
          link: '#' + field,
          label: `The field "${getTitle(
            field,
            document.type
          )}" needs at least ${this.minCharacters} items, but you have ${
            array.length
          }.`
        })
      ];
    }
    return [];
  }
  getErrors(document, field) {
    if (this.fulfilled) {
      const fulfilled = this.fulfilled(document);
      if (!fulfilled) {
        return [
          new SubmitError({
            link: `#${slugify(field).toLowerCase()}`,
            label: `The field "${getTitle(field, document.type)}" is required.`
          })
        ];
      }
      return [];
    }
    if (this.array) {
      return this.getArrayErrors(document, field);
    }
    const editorState = property(field)(document);
    if (!editorState && this.required) {
      return [
        new SubmitError({
          link: `#${slugify(field).toLowerCase()}`,
          label: `The field "${getTitle(
            field,
            document.type
          )}" is mandatory, but is empty.`
        })
      ];
    }
    const content =
      isString(editorState) || !editorState
        ? editorState
        : editorState.getCurrentContent().getPlainText();
    const length = isString(content) ? content.trim().length : 0;
    if (this.required && length === 0) {
      return [
        new SubmitError({
          link: `#${field}`,
          label: `The field "${getTitle(
            field,
            document.type
          )}" is mandatory, but is empty.`
        })
      ];
    }
    if (this.maxCharacters && length > this.maxCharacters) {
      return [
        new SubmitError({
          link: `#${field}`,
          label: `The field "${getTitle(field, document.type)}" can only have ${
            this.maxCharacters
          } characters, but has ${length}.`
        })
      ];
    }
    if (this.minCharacters && length < this.minCharacters) {
      return [
        new SubmitError({
          link: `#${field}`,
          label: `The field "${getTitle(
            field,
            document.type
          )}" must have at least ${
            this.minCharacters
          } characters, but has only ${length}.`
        })
      ];
    }
    return [];
  }
}

export default Requirement;
