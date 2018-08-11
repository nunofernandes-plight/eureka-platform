import React, {Component} from 'react';
import styled from 'styled-components';
import {Route} from 'react-router';
import {Link} from 'react-router-dom';
import {__GRAY_200} from '../../helpers/colors.js';
import EurekaLogo from '../icons/EurekaLogo.js';
import {NavItem, Separator} from './NavItem.js';
import Dashboard from './Dashboard.js';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  width: 270px;
  height: 100%;
  left: 0;
  top: 135px;
  z-index: 600;
  background: white;
  transition-duration: 0.15s;
  transition-timing-function: ease-in-out;
  transition-property: width;
  flex: 1 1 auto;
  border-right: 1px solid ${__GRAY_200};
  overflow-x: hidden;
`;

const TopLogo = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
`;

const Items = styled.div`
  display: flex;
  flex-direction: column;
`;

const NotificationBell = styled.div`
  position: absolute;
  border-radius: 50%;
  background: red;
  margin-left: 8px;
  width: 20px;
  height: 20px;
`;

class PanelLeft extends Component {
  render() {
    return (
      <Container>
        <TopLogo>
          <NotificationBell />
          <EurekaLogo height={40} />
        </TopLogo>
        <Items>
          <Separator text={'General'} />
          <Link
            style={{textDecoration: 'none'}}
            to={`${this.props.base}/dashboard`}
          >
            <NavItem status="active" icon={'dashboard'} width={20} height={20}>
              {' '}
              Dashboard
            </NavItem>
          </Link>
          <Link
            style={{textDecoration: 'none'}}
            to={`${this.props.base}/articles`}
          >
            <NavItem icon={'article'} width={20} height={20}>
              My Articles
            </NavItem>
          </Link>{' '}
          <Link
            style={{textDecoration: 'none'}}
            to={`${this.props.base}/reviews`}
          >
            <NavItem icon={'review'} width={20} height={20}>
              My Reviews
            </NavItem>
          </Link>{' '}
          <Link
            style={{textDecoration: 'none'}}
            to={`${this.props.base}/linked`}
          >
            <NavItem icon={'link'} width={20} height={20}>
              My Linked articles
            </NavItem>
          </Link>
          <Separator text={'Personal'} />
          <Link
            style={{textDecoration: 'none'}}
            to={`${this.props.base}/wallet`}
          >
            <NavItem icon={'wallet'} width={20} height={20}>
              My Wallet
            </NavItem>
          </Link>
          <Link
            style={{textDecoration: 'none'}}
            to={`${this.props.base}/account`}
          >
            <NavItem icon={'account'} width={20} height={20}>
              My Account
            </NavItem>
          </Link>
          <Separator text={'History'} />
          <Link
            style={{textDecoration: 'none'}}
            to={`${this.props.base}/actions`}
          >
            <NavItem icon={'ethereum'} width={20} height={20}>
              My Actions
            </NavItem>
          </Link>
        </Items>
      </Container>
    );
  }
}

export default PanelLeft;
