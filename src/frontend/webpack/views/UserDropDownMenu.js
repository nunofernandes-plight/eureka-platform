import React from 'react';
import styled from 'styled-components';
import {__GRAY_200} from '../../helpers/colors.js';
import Icon from './icons/Icon.js';
import EurekaLogo from './icons/EurekaLogo.js';
import OutsideAlerter from '../components/Reviews/OutsideAlerter.js';

const Parent = styled.div`
  position: absolute;
  top: ${props => props.top}px;
  right: ${props => props.right}px;
  padding-top: ${props => (props.noPadding ? 0 : 10)}px;
  transition: 0.5s ease-in-out;
  z-index: 1000;
  pointer-events: ${props => (props.visible ? 'auto' : 'none')};
  opacity: ${props => (props.visible ? 1 : 0)};
`;
const Navigation = styled.div`
  background: ${props =>
    props.background ? props.background : 'rgb(255, 255, 255)'};
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  min-width: ${props => (props.noMinWidth ? null : 180 + 'px')};
  padding: ${props => (props.noPadding ? 0 : '5px 0')};
  border: ${props => (props.border ? '1px solid ' + props.border : null)};
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
  padding: ${props => (props.tabPadding ? props.tabPadding : '5px 25px')};
  cursor: pointer;
`;

const SmallSquare = styled.div`
  width: 20px;
  height: 20px;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  background: ${props =>
    props.background ? props.background : 'rgb(255, 255, 255)'};
  position: absolute;
  right: 6px;
  top: 15px;
  z-index: -1;
  transform: translateY(-7px) rotate(45deg);
`;

const IconContainer = styled.div`
  background: ${props => props.color};
  color: #fff;
  border-radius: 50%;
  padding: 0.5rem;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  width: ${props => props.iconSize * 2.33}px;
  height: ${props => props.iconSize * 2.33}px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Text = styled.h4`
  margin-left: 10px;
  margin-top: 0;
  margin-bottom: 0;
  color: ${props => props.color};
  font-size: 12px;
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
      {...props}
      onClick={() => {
        props.onClick(props);
      }}
    >
      <IconContainer color={props.color} iconSize={props.iconSize}>
        {props.icon === 'eureka' ? (
          <EurekaLogo width={props.width + 2} height={props.height + 2} />
        ) : (
          <Icon
            icon={props.icon}
            material={props.material}
            width={props.width}
            height={props.height}
            noMove
          />
        )}
      </IconContainer>
      <Text color={props.color}>{props.text}</Text>
    </TabContainer>
  );
};

const DropDown = ({items, iconSize, ...otherProps}) => {
  const props = otherProps;
  return (
    <Navigation {...props}>
      <Tabs>
        {items.map((item, index) => {
          return (
            <div key={index}>
              <Tab
                iconSize={iconSize}
                width={iconSize}
                height={iconSize}
                {...props}
                {...item}
                onClick={item => {
                  props.onClick(item);
                }}
              />
              {index !== items.length ? null : <Separator />}
            </div>
          );
        })}
      </Tabs>
    </Navigation>
  );
};

class UserDropDownMenu extends React.Component {
  render() {
    const iconSize = this.props.iconSize ? this.props.iconSize : 15;
    return (
      <Parent visible={this.props.visible} {...this.props}>
        {this.props.noSquare ? null : <SmallSquare {...this.props} />}
          <DropDown
            items={this.props.items}
            iconSize={iconSize}
            onClick={item => {
              this.props.action(item);
            }}
            {...this.props}
          />
      </Parent>
    );
  }
}

export default UserDropDownMenu;
