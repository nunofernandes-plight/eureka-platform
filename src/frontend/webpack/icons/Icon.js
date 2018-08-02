import React from 'react';
import styled from 'styled-components';

const MyIcon = styled.svg`
  &:hover {
    transition: 0.5s;
  }
  cursor: pointer;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  vertical-align: middle;
  fill: ${props => (props.color ? props.color : null)};
  margin-bottom: ${props => (props.bottom ? props.bottom + 'px' : null)};
  margin-left: ${props => (props.left ? props.left + 'px' : null)};
  margin-right: ${props => (props.right ? props.right + 'px' : null)};
  margin-top: ${props => (props.top ? props.top + 'px' : null)};
`;

const Icon = props => {
  switch (props.icon) {
    case 'chevron-down':
      return (
        <MyIcon
          {...props}
          aria-hidden="true"
          data-prefix="fas"
          data-icon="chevron-down"
          className="svg-inline--fa fa-chevron-down fa-w-14"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
        >
          <path
            fill="currentColor"
            d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"
          />
        </MyIcon>
      );

    case 'plus':
      return (
        <MyIcon
          {...props}
          aria-hidden="true"
          data-prefix="fas"
          data-icon="plus"
          className="svg-inline--fa fa-plus fa-w-14"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
        >
          <path
            fill="currentColor"
            d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"
          />
        </MyIcon>
      );

    case 'arrow-right':
      return (
        <MyIcon
          {...props}
          aria-hidden="true"
          data-prefix="fas"
          data-icon="arrow-right"
          className="svg-inline--fa fa-arrow-right fa-w-14"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
        >
          <path
            fill="currentColor"
            d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"
          />
        </MyIcon>
      );

    case 'check':
      return (
        <MyIcon
          {...props}
          aria-hidden="true"
          data-prefix="fas"
          data-icon="check"
          className="svg-inline--fa fa-check fa-w-16"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path
            fill="currentColor"
            d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"
          />
        </MyIcon>
      );

    case 'read':
      return (
        <MyIcon
          {...props}
          aria-hidden="true"
          data-prefix="fab"
          data-icon="readme"
          className="svg-inline--fa fa-readme fa-w-18"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 576 512"
        >
          <path
            fill="currentColor"
            d="M528.3 46.5H388.5c-48.1 0-89.9 33.3-100.4 80.3-10.6-47-52.3-80.3-100.4-80.3H48c-26.5 0-48 21.5-48 48v245.8c0 26.5 21.5 48 48 48h89.7c102.2 0 132.7 24.4 147.3 75 .7 2.8 5.2 2.8 6 0 14.7-50.6 45.2-75 147.3-75H528c26.5 0 48-21.5 48-48V94.6c0-26.4-21.3-47.9-47.7-48.1zM242 311.9c0 1.9-1.5 3.5-3.5 3.5H78.2c-1.9 0-3.5-1.5-3.5-3.5V289c0-1.9 1.5-3.5 3.5-3.5h160.4c1.9 0 3.5 1.5 3.5 3.5v22.9zm0-60.9c0 1.9-1.5 3.5-3.5 3.5H78.2c-1.9 0-3.5-1.5-3.5-3.5v-22.9c0-1.9 1.5-3.5 3.5-3.5h160.4c1.9 0 3.5 1.5 3.5 3.5V251zm0-60.9c0 1.9-1.5 3.5-3.5 3.5H78.2c-1.9 0-3.5-1.5-3.5-3.5v-22.9c0-1.9 1.5-3.5 3.5-3.5h160.4c1.9 0 3.5 1.5 3.5 3.5v22.9zm259.3 121.7c0 1.9-1.5 3.5-3.5 3.5H337.5c-1.9 0-3.5-1.5-3.5-3.5v-22.9c0-1.9 1.5-3.5 3.5-3.5h160.4c1.9 0 3.5 1.5 3.5 3.5v22.9zm0-60.9c0 1.9-1.5 3.5-3.5 3.5H337.5c-1.9 0-3.5-1.5-3.5-3.5V228c0-1.9 1.5-3.5 3.5-3.5h160.4c1.9 0 3.5 1.5 3.5 3.5v22.9zm0-60.9c0 1.9-1.5 3.5-3.5 3.5H337.5c-1.9 0-3.5-1.5-3.5-3.5v-22.8c0-1.9 1.5-3.5 3.5-3.5h160.4c1.9 0 3.5 1.5 3.5 3.5V190z"
          />
        </MyIcon>
      );

    case 'close':
      return (
        <MyIcon
          {...props}
          aria-hidden="true"
          data-prefix="fas"
          data-icon="times"
          className="svg-inline--fa fa-times fa-w-11"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 352 512"
        >
          <path
            fill="currentColor"
            d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
          />
        </MyIcon>
      );

    case 'cloud':
      return (
        <MyIcon
          {...props}
          aria-hidden="true"
          data-prefix="fas"
          data-icon="cloud"
          className="svg-inline--fa fa-cloud fa-w-20"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 512"
        >
          <path
            fill="currentColor"
            d="M537.6 226.6c4.1-10.7 6.4-22.4 6.4-34.6 0-53-43-96-96-96-19.7 0-38.1 6-53.3 16.2C367 64.2 315.3 32 256 32c-88.4 0-160 71.6-160 160 0 2.7.1 5.4.2 8.1C40.2 219.8 0 273.2 0 336c0 79.5 64.5 144 144 144h368c70.7 0 128-57.3 128-128 0-61.9-44-113.6-102.4-125.4z"
          />
        </MyIcon>
      );

    case 'internet':
      return (
        <MyIcon
          {...props}
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 44 44"
        >
          <g>
            <g>
              <path d="M43.951,21C43.44,9.652,34.349,0.562,23,0.051V0h-2v0.051C9.651,0.562,0.56,9.652,0.049,21H0v2h0.049    C0.56,34.348,9.651,43.438,21,43.949V44h2v-0.051C34.349,43.438,43.44,34.348,43.951,23H44v-2H43.951z M18.593,2.312    C15.635,4.185,13.141,6.868,11.315,10H6.023C9.019,6.018,13.471,3.192,18.593,2.312z M4.719,12h5.554    c-1.304,2.801-2.1,5.87-2.239,9H2.045C2.207,17.727,3.17,14.672,4.719,12z M2.045,23h5.988c0.14,3.13,0.936,6.199,2.239,9H4.719    C3.17,29.328,2.207,26.273,2.045,23z M6.023,34h5.291c1.826,3.132,4.32,5.815,7.278,7.688C13.471,40.808,9.019,37.982,6.023,34z     M21,40.787C18.05,39.3,15.527,36.898,13.641,34H21V40.787z M21,32h-8.521c-1.418-2.769-2.29-5.862-2.444-9H21V32z M21,21H10.035    c0.154-3.138,1.026-6.231,2.444-9H21V21z M21,10h-7.359C15.527,7.102,18.05,4.7,21,3.213V10z M37.977,10h-5.27    c-1.801-3.113-4.258-5.787-7.171-7.669C30.604,3.236,35.006,6.049,37.977,10z M23,3.157c2.963,1.497,5.493,3.92,7.383,6.843H23    V3.157z M23,12h8.535c1.409,2.771,2.276,5.863,2.43,9H23V12z M23,23h10.965c-0.153,3.137-1.021,6.229-2.43,9H23V23z M23,34h7.383    c-1.89,2.923-4.42,5.346-7.383,6.843V34z M25.536,41.669c2.913-1.882,5.37-4.556,7.171-7.669h5.27    C35.006,37.951,30.604,40.764,25.536,41.669z M39.283,32h-5.54c1.295-2.803,2.085-5.871,2.224-9h5.988    C41.793,26.273,40.831,29.328,39.283,32z M35.967,21c-0.139-3.129-0.929-6.197-2.224-9h5.54c1.548,2.672,2.51,5.727,2.672,9    H35.967z" />
            </g>
          </g>
        </MyIcon>
      );

    case 'ethereum':
      return (
        <MyIcon
          {...props}
          aria-hidden="true"
          data-prefix="fab"
          data-icon="ethereum"
          className="svg-inline--fa fa-ethereum fa-w-10"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 320 512"
        >
          <path
            fill="currentColor"
            d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"
          />
        </MyIcon>
      );

    case 'exlamation':
      return (
        <MyIcon
          {...props}
          aria-hidden="true"
          data-prefix="fas"
          data-icon="exclamation"
          className="svg-inline--fa fa-exclamation fa-w-6"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 192 512"
        >
          <path
            fill="currentColor"
            d="M176 432c0 44.112-35.888 80-80 80s-80-35.888-80-80 35.888-80 80-80 80 35.888 80 80zM25.26 25.199l13.6 272C39.499 309.972 50.041 320 62.83 320h66.34c12.789 0 23.331-10.028 23.97-22.801l13.6-272C167.425 11.49 156.496 0 142.77 0H49.23C35.504 0 24.575 11.49 25.26 25.199z"
          />
        </MyIcon>
      );

    case 'exlamation-circle':
      return (
        <MyIcon
          {...props}
          aria-hidden="true"
          data-prefix="fas"
          data-icon="exclamation-circle"
          className="svg-inline--fa fa-exclamation-circle fa-w-16"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path
            fill="currentColor"
            d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"
          />
        </MyIcon>
      );

    case 'thumbs-up':
      return (
        <MyIcon
          {...props}
          aria-hidden="true"
          data-prefix="fas"
          data-icon="thumbs-up"
          className="svg-inline--fa fa-thumbs-up fa-w-16"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path
            fill="currentColor"
            d="M104 224H24c-13.255 0-24 10.745-24 24v240c0 13.255 10.745 24 24 24h80c13.255 0 24-10.745 24-24V248c0-13.255-10.745-24-24-24zM64 472c-13.255 0-24-10.745-24-24s10.745-24 24-24 24 10.745 24 24-10.745 24-24 24zM384 81.452c0 42.416-25.97 66.208-33.277 94.548h101.723c33.397 0 59.397 27.746 59.553 58.098.084 17.938-7.546 37.249-19.439 49.197l-.11.11c9.836 23.337 8.237 56.037-9.308 79.469 8.681 25.895-.069 57.704-16.382 74.757 4.298 17.598 2.244 32.575-6.148 44.632C440.202 511.587 389.616 512 346.839 512l-2.845-.001c-48.287-.017-87.806-17.598-119.56-31.725-15.957-7.099-36.821-15.887-52.651-16.178-6.54-.12-11.783-5.457-11.783-11.998v-213.77c0-3.2 1.282-6.271 3.558-8.521 39.614-39.144 56.648-80.587 89.117-113.111 14.804-14.832 20.188-37.236 25.393-58.902C282.515 39.293 291.817 0 312 0c24 0 72 8 72 81.452z"
          />
        </MyIcon>
      );
    case 'bell':
      return (
        <MyIcon
          {...props}
          aria-hidden="true"
          data-prefix="fas"
          data-icon="bell"
          className="svg-inline--fa fa-bell fa-w-14"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
        >
          <path
            fill="currentColor"
            d="M224 512c35.32 0 63.97-28.65 63.97-64H160.03c0 35.35 28.65 64 63.97 64zm215.39-149.71c-19.32-20.76-55.47-51.99-55.47-154.29 0-77.7-54.48-139.9-127.94-155.16V32c0-17.67-14.32-32-31.98-32s-31.98 14.33-31.98 32v20.84C118.56 68.1 64.08 130.3 64.08 208c0 102.3-36.15 133.53-55.47 154.29-6 6.45-8.66 14.16-8.61 21.71.11 16.4 12.98 32 32.1 32h383.8c19.12 0 32-15.6 32.1-32 .05-7.55-2.61-15.27-8.61-21.71z"
          />
        </MyIcon>
      );
    default:
      return <div>default</div>;
  }
};

export default Icon;
