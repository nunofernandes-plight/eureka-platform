import React from 'react';
import styled from 'styled-components';

const MyFigure = styled.img`
  width: ${props => (props.width ? props.width + 'px' : 'auto')};
  max-width: ${props => (props.maxWidth ? props.maxWidth + 'px' : null)};
  height: ${props => (props.height ? props.height + 'px' : 'auto')};
  margin-bottom: ${props => (props.bottom ? props.bottom + 'px' : null)};
  margin-left: ${props => (props.left ? props.left + 'px' : null)};
  margin-right: ${props => (props.right ? props.right + 'px' : null)};
  margin-top: ${props => (props.top ? props.top + 'px' : null)};
  padding-bottom: ${props =>
    props.paddingBottom ? props.paddingBottom + 'px' : null};
  padding-left: ${props =>
    props.paddingLeft ? props.paddingLeft + 'px' : null};
  padding-right: ${props =>
    props.paddingRight ? props.paddingRight + 'px' : null};
  padding-top: ${props => (props.paddingTop ? props.paddingTop + 'px' : null)};
  border-radius: 4px;
`;

export const Figure = ({src, ...otherProps}) => {
  return <MyFigure src={src} {...otherProps} />;
};
