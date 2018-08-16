import _ from 'underscore';
import validator from 'validator';

export const usernameIsValid = username => {
    return Boolean(username.match(/^[a-zA-Z_\-0-9]{0,64}$/));
};

export const getUserInDocument = (request, document) => {
    var authors = _.pluck(document.authors, '_id');
    var authoremails = _.pluck(document.authors, 'email');

    var email =
        request.user && request.user.confirmed ? request.user.email : null;
    var userId = request.user ? request.user._id.toString() : null;

    if (userId && _.contains(authors, userId)) {
        return _.findWhere(document.authors, {_id: userId});
    }
    if (
        email &&
        authoremails
            .filter(Boolean)
            .find(e => e.toLowerCase() === email.toLowerCase())
    ) {
        return document.authors.find(
            a => a.email && a.email.toLowerCase() === email.toLowerCase()
        );
    }
    return false;
};

export const userIsAuthorOfDocument = (request, document) => {
    return Boolean(getUserInDocument(request, document));
};

export const userIsEditor = request => {
    return request.user && request.user.editor === true;
};

export const userIsEditorialAssistant = request => {
    return request.user && request.user.editorial_assistant === true;
};

export const userMayEditDocument = (request, document) => {
    if (userIsEditorialAssistant(request)) {
        return true;
    }
    var useritem = getUserInDocument(request, document);
    if (!useritem) {
        return false;
    }
    return useritem.permission === 'edit' || useritem.is_corresponding_author;
};

export const userMayReviewDocument = (request, document) => {
    if (!request.user) {
        return false;
    }
    if (document.reviewers.indexOf(request.user._id.toString()) > -1) {
        return true;
    }
    return false;
};

export const userIsAuthorOfMethod = (request, method) => {
    if (!request.user) {
        return false;
    }
    return method.author.toString() === request.user._id.toString();
};

export const isEmail = validator.isEmail;


export const getReviewError = document => {
    if (!document.editor_comment || document.editor_comment === '') {
        return 'No comment entered.';
    }
    var reviews = _.compact(_.pluck(document.reviewer_queue, 'review'));
    for (var i = 0; i < reviews.length; i++) {
        var review = reviews[i];
        var rating_keys = _.keys(review.rating);
        for (var j = 0; j < rating_keys.length; j++) {
            var rating = review.rating[rating_keys[j]];
            if (rating === 0) {
                return 'Reviewer has flagged the document as fraudulent.';
            }
        }
    }
    if (reviews.length < 2) {
        return 'Need 2 reviews, ' + reviews.length + ' so far.';
    }
    return false;
};

export const submissionReviewerError = (reviewers, document) => {
    var reviewersNeeded = document.depth > 0 ? 2 : 5;
    if (!reviewers) {
        return 'No reviewers';
    }
    if (reviewers.length < reviewersNeeded && document.depth === 0) {
        return (
            'Need ' +
            (reviewersNeeded - reviewers.length) +
            ' more reviewer' +
            (reviewers.length < reviewersNeeded - 1 ? 's' : '')
        );
    }
    var emails = _.pluck(reviewers, 'email');
    for (var i = 0; i < emails.length; i++) {
        if (!isEmail(emails[i])) {
            return 'All reviewers need emails';
        }
    }
    return false;
};
