import React from 'react';
import styled from 'styled-components';
const Parent = styled.div`
  position: absolute;
  top: 40px;
  right: 20px;
  padding-top: 10px;
  transition: 0.5s ease-in-out;
  z-index: 1000;
`;
const Navigation = styled.div`
  background: rgb(255, 255, 255);
  width: 300px;
  height: 200px;
`;

const renderIfVisible = props => {
  if (props.visible) {
    return <DropDown />;
  } else {
    return null;
  }
};

const DropDown = () => {
  return <Navigation>Ich glaub ned</Navigation>;
};

const UserDropDownMenu = props => {
  return <Parent>{renderIfVisible(props)}</Parent>;
};

export default UserDropDownMenu;
