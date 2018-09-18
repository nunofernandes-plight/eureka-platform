import React from 'react';
import Icon from '../../views/icons/Icon.js';

export const GoBack = props => {
  return (
    <Icon
      icon={'material'}
      material={'arrow_back_ios'}
      color={'white'}
      width={25}
      height={25}
      style={{alignSelf: 'center'}}
      onClick={() => {
        props.history.goBack();
      }}
    />
  );
};
