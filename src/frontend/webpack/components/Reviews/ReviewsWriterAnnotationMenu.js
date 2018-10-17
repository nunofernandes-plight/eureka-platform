import React from 'react';
import styled from 'styled-components';
import UserDropDownMenu from '../../views/UserDropDownMenu.js';
import {__GRAY_100, __GRAY_200} from '../../../helpers/colors.js';
import {MenuItems} from './ReviewsWriterAnnotationMenuItems.js';

const Container = styled.div`
  position: relative;
`;

const ReviewsWriterAnnotationMenu = ({visible}) => {
  return (
    <Container>
        <UserDropDownMenu
          visible={visible}
          top={2}
          right={-75}
          iconSize={10}
          noMinWidth
          noSquare
          tabPadding={'10px'}
          noPadding
          border={__GRAY_200}
          items={MenuItems}
        />
    </Container>
  );
};

export default ReviewsWriterAnnotationMenu;
