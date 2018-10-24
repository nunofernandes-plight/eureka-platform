import React from 'react';
import styled from 'styled-components';
import UserDropDownMenu from '../../../views/UserDropDownMenu.js';
import {__GRAY_200} from '../../../../helpers/colors.js';
import {MenuItems} from './AnnotationMenuItems.js';
import OutsideAlerter from '../OutsideAlerter.js';

const Container = styled.div`
  position: relative;
`;

const AnnotationMenu = ({visible, ...otherProps}) => {
  return (
    <Container>
      <OutsideAlerter
        onClickInside={() => {
          otherProps.onClickInside();
        }}
        onClickOutside={() => {
          otherProps.onClickOutside();
        }}
      >
        <UserDropDownMenu
          visible={visible}
          top={14}
          right={-75}
          iconSize={10}
          noMinWidth
          noSquare
          tabPadding={'10px'}
          noPadding
          border={__GRAY_200}
          items={MenuItems}
          action={actionType => {
            otherProps.action(actionType);
          }}
        />
      </OutsideAlerter>
    </Container>
  );
};

export default AnnotationMenu;
