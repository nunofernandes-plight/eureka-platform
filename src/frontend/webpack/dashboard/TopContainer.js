import styled from 'styled-components';
import {__MAIN, __SECOND, __THIRD} from '../../helpers/colors.js';

export const TopContainer = styled.div`
  min-height: 270px;
  background: linear-gradient(
    150deg,
    ${__THIRD} 15%,
    ${__SECOND} 70%,
    ${__MAIN} 94%
  );
`;
