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

const Dropper = styled.div`
  &:hover {
    border: 2px dashed ${__GRAY_500};
  }
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  border-radius: 20px;

  border: ${props =>
    !props.isDragActive ? `2px dashed ${__GRAY_300}` : `2px dashed ${__FIFTH}`};
  min-height: 150px;
  height: 100%;
  cursor: pointer;
  transition: 0.2s ease-in-out;
`;

const DropperContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const DropperTitle = styled.h2`
  color: ${props => (props.isHover ? `${__GRAY_500}` : `${__GRAY_300}`)};
  margin-top: 4px;
`;

class PDFUploader extends React.Component {
  constructor() {
    super();
    this.state = {isHover: false};
  }
  onDrop = (acceptedFiles, rejectedFiles) => {
    // Do something with files
  };

  getIconColor(isActive) {
    if (this.state.isHover) {
      return __GRAY_500;
    }
    if (isActive) {
      return __FIFTH;
    }
    return __GRAY_300;
  }

  render() {
    return (
      <DropZoneContainer>
        <StyledDropzone
          onDrop={this.onDrop.bind(this)}
          onMouseEnter={() => {
            this.setState({isHover: true});
          }}
          onMouseLeave={() => {
            this.setState({isHover: false});
          }}
        >
          {({isDragActive}) => {
            return (
              <Dropper isDragActive={isDragActive}>
                <DropperContent>
                  <Icon
                    noMove
                    icon={'uploadPDF'}
                    width={75}
                    height={75}
                    color={this.getIconColor(isDragActive)}
                  />
                  <DropperTitle
                    isHover={this.state.isHover}
                    isDragActive={this.state.isDragActive}
                  >
                    Upload your PDF here
                  </DropperTitle>
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
