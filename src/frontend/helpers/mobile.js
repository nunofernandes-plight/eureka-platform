import {css} from 'styled-components';

export const SMALL_DEVICES = (...args) => css`
  // Small devices (landscape phones, 576px and up)
  @media (min-width: 576px) {
    ${css(...args)};
  }
`;

export const MEDIUM_DEVICES = (...args) => css`
  // Medium devices (tablets, 768px and up)
  @media (min-width: 768px) {
    ${css(...args)};
  }
`;

export const LARGE_DEVICES = (...args) => css`
  // Large devices (desktops, 992px and up)
  @media (min-width: 992px) {
    ${css(...args)};
  }
`;

export const EXTRA_LARGE_DEVICES = (...args) => css`
  // Extra large devices (large desktops, 1200px and up)
  @media (min-width: 1200px) {
    ${css(...args)};
  }
`;
