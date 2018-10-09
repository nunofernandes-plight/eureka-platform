import React from 'react';
import styled from 'styled-components';
import Icon from '../../views/icons/Icon.js';
import {__FIFTH} from '../../../helpers/colors.js';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  padding: 10px;
  border-radius: 5px;
  margin-top: -28px;
  margin-right: ${props => (props.back ? 'auto' : null)};
  margin-left: ${props => (props.forward ? 'auto' : null)};
  cursor: pointer;
  transform: scale(1.1);
  transition: 0.25s all;
`;

const Text = styled.div`
  color: ${__FIFTH};
  font-size: 11px;
`;
export const Go = props => {
  return (
    <Container
      {...props}
      onClick={() => {
        if (props.back) {
          props.history.goBack();
        } else if (props.forward) {
          props.history.goForward();
        }
      }}
    >
      <Icon
        noMove
        icon={'material'}
        material={'arrow_back_ios'}
        color={__FIFTH}
        width={18}
        height={18}
        style={{alignSelf: 'center'}}
      />
      {props.back ? <Text>Go Back</Text> : <Text>Go Forward</Text>}
    </Container>
  );
};
