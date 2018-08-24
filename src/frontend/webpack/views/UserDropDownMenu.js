import React from 'react';
import styled from 'styled-components';
import Icon from './icons/Icon.js';
import {__THIRD} from '../../helpers/colors.js';
import {Items} from './UserDropDownItems.js';
import {getDomain} from '../../../helpers/getDomain.js';

const Parent = styled.div`
  position: absolute;
  top: 40px;
  right: 20px;
  padding-top: 10px;
  transition: 0.5s ease-in-out;
  z-index: 1000;
  cursor: pointer;
  pointer-events: ${props => (props.visible ? 'auto' : 'none')};
  opacity: ${props => (props.visible ? 1 : 0)};
`;
const Navigation = styled.div`
  background: rgb(255, 255, 255);
  width: 300px;
  height: 200px;
  padding: 1rem 2rem;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  border-radius: 2px;
`;

const Tabs = styled.div`
  display: flex;
  flex-direction: column;
`;

const TabContainer = styled.div`
  display: flex;
`;

const SmallSquare = styled.div`
  width: 20px;
  height: 20px;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  background: rgb(255, 255, 255);
  position: absolute;
  right: 6px;
  top: 15px;
  z-index: -1;
  transform: translateY(-7px) rotate(45deg);
`;

const Text = styled.div``;

const Tab = props => {
  return (
    <TabContainer
      onClick={() => {
        props.onClick(props);
      }}
    >
      <Icon
        icon={props.icon}
        material={props.material}
        width={props.width}
        height={props.height}
        color={__THIRD}
        noMove
      />
      <Text>{props.text}</Text>
    </TabContainer>
  );
};

const DropDown = props => {
  return (
    <Navigation>
      <Tabs>
        {Items.map((item, index) => {
          return (
            <Tab
              key={index}
              width={25}
              height={25}
              {...item}
              onClick={item => {
                props.onClick(item);
              }}
            />
          );
        })}
      </Tabs>
    </Navigation>
  );
};

class UserDropDownMenu extends React.Component {
  render() {
    return (
      <Parent visible={this.props.visible}>
        <SmallSquare />
        <DropDown
          onClick={item => {
            this.props.action(item);
          }}
        />
      </Parent>
    );
  }
}

export default UserDropDownMenu;
