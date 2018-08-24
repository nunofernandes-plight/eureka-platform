import React from 'react';
import styled from 'styled-components';
import Icon from './icons/Icon.js';
import {
  __ALERT_ERROR,
  __FIFTH,
  __GRAY_100,
  __GRAY_200,
  __THIRD
} from '../../helpers/colors.js';
import {Items} from './UserDropDownItems.js';
import {getDomain} from '../../../helpers/getDomain.js';

const Parent = styled.div`
  position: absolute;
  top: 40px;
  right: 20px;
  padding-top: 10px;
  transition: 0.5s ease-in-out;
  z-index: 1000;
  pointer-events: ${props => (props.visible ? 'auto' : 'none')};
  opacity: ${props => (props.visible ? 1 : 0)};
`;
const Navigation = styled.div`
  background: rgb(255, 255, 255);
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  min-width: 180px;
  padding: 5px 0;
`;

const Tabs = styled.div`
  display: flex;
  flex-direction: column;
`;

const TabContainer = styled.div`
  &:hover {
    background: ${__GRAY_200};
  }
  transition: 0.3s all;
  display: flex;
  align-items: center;
  padding: 5px 15px;
  cursor: pointer;
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

const IconContainer = styled.div`
  background: ${__FIFTH};
  color: #fff;
  border-radius: 50%;
  padding: 0.5rem;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Text = styled.h3`
  margin-left: 10px;
  margin-top: 0;
  margin-bottom: 0;
  color: ${__FIFTH};
`;

const Separator = styled.div`
  width: 100%;
  height: 2px;
  background: ${__GRAY_200};
  margin: 10px 0;
`;

const Tab = props => {
  return (
    <TabContainer
      onClick={() => {
        props.onClick(props);
      }}
    >
      <IconContainer>
        <Icon
          icon={props.icon}
          material={props.material}
          width={props.width}
          height={props.height}
          noMove
        />
      </IconContainer>
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
            <div>
              <Tab
                key={index}
                width={15}
                height={15}
                {...item}
                onClick={item => {
                  props.onClick(item);
                }}
              />
              {index !== Items.length ? null : <Separator />}
            </div>
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
