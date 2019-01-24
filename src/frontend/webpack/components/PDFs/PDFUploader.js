import React from 'react';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';
import styled from 'styled-components';
import {
  __FIFTH,
  __GRAY_200,
  __GRAY_300,
  __GRAY_400,
  __GRAY_500
} from '../../../helpers/colors.js';
import Icon from '../../views/icons/Icon.js';

const DropZoneContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  min-width: 200px;
  width: 60%;
  margin: 2em 0;
`;

const StyledDropzone = styled(Dropzone)`
  width: 100%;
`;

const DropperContent = styled.div`
  color: ${__GRAY_300};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  transition: 0.2s ease-in-out;
`;

const Dropper = styled.div`
  &:hover {
    border: 2px dashed ${__GRAY_500};
    & ${DropperContent} {
      color: ${__GRAY_500};
      & > svg {
        fill: ${__GRAY_500};
      }
    }
  }

  & {
    ${props =>
      props.isDragActive
        ? `
          border: 2px dashed ${__FIFTH};
           & ${DropperContent} {
              color: ${__FIFTH};   
               & > svg {
                  fill: ${__FIFTH};
               }
           }
          `
        : null}
  }

  border: 2px dashed ${__GRAY_300};
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  border-radius: 20px;
  min-height: 150px;
  height: 100%;
  cursor: pointer;
  transition: 0.2s ease-in-out;
`;

const DropperTitle = styled.h2`
  margin-top: 4px;
`;

class PDFUploader extends React.Component {
  onDrop = (acceptedFiles, rejectedFiles) => {
    // Do something with files
  };

  render() {
    return (
      <DropZoneContainer>
        <StyledDropzone onDrop={this.onDrop.bind(this)}>
          {({isDragActive}) => {
            return (
              <Dropper isDragActive={isDragActive}>
                <DropperContent>
                  <Icon
                    noMove
                    icon={'uploadPDF'}
                    width={75}
                    height={75}
                    color={__GRAY_300}
                  />
                  <DropperTitle>Upload your PDF here</DropperTitle>
                </DropperContent>
              </Dropper>
            );
          }}
        </StyledDropzone>
      </DropZoneContainer>
    );
  }
}

export default PDFUploader;
