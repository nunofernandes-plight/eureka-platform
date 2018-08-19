import React from 'react';
export const fromS3toCdn = url => {
  return 'https://cdn.sciencematters.io' + url.toString().slice(36) + '?max-w=700&fm=png';
};
