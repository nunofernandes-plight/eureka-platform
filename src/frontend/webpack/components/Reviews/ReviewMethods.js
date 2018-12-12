import {getDomain} from '../../../../helpers/getDomain.mjs';

export const getArticlesInvitedForReviewing = () => {
  return fetch(`${getDomain()}/api/reviews/invited`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
};

export const getArticlesOpenToReview = (page, limit) => {
  return fetch(`${getDomain()}/api/articles/reviewable/community?page=` +
    page +
    `&limit=` +
    limit,
    {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
};

export const getMyReviews = () => {
  return fetch(`${getDomain()}/api/reviews/myreviews`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
};

export const saveEditorApprovedReviewToDB = review => {
  return fetch(`${getDomain()}/api/reviews/editorApproved`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(review)
  });
};

export const addCommunityReviewToDB = review => {
  return fetch(`${getDomain()}/api/reviews/community`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(review)
  });
};

export const updateReview = review => {
  return fetch(`${getDomain()}/api/reviews/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(review)
  });
};

/*
  Annotation methods
 */
export const getAnnotations = reviewId => {
  return fetch(`${getDomain()}/api/annotations/${reviewId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
};

export const addAnnotation = review => {
  return fetch(`${getDomain()}/api/annotations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(review)
  });
};

export const saveAnnotation = annotation => {
  return fetch(`${getDomain()}/api/annotations/${annotation._id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(annotation)
  });
};

export const deleteAnnotation = annotation => {
  return fetch(`${getDomain()}/api/annotations/${annotation._id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(annotation)
  });
};
