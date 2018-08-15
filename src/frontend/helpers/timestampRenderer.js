import React from 'react';

export const renderTimestamp = timestamp => {
  const ts = new Date(timestamp);
  const localDate = ts.toLocaleDateString();
  const localTime = ts.toLocaleTimeString();
  return localDate + ' - ' + localTime;
};
