import React, {Component} from 'react';
import styled, {keyframes} from 'styled-components';
import Icon from '../webpack/icons/Icon.js';

const ModalParent = styled.div`
  position: fixed;
  z-index: 1050;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  outline: 0;
  transition: opacity 0.15s linear;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
`;

const modalFade = keyframes`
 from {transform: translateY(-50%);opacity: 0;}
  to {transform: translateY(0);opacity: 1;}
`;

const MyModal = styled.div`
  height: 420px;
  max-width: 500px;
  margin: 1.75rem auto;
  display: flex;
  flex-direction: column;
  border-radius: 0.3rem;
  outline: 0;
  background-color: #fff;
  background-clip: padding-box;
  box-shadow: rgba(50, 50, 93, 0.2) 0px 15px 35px 0px,
    rgba(0, 0, 0, 0.17) 0px 5px 15px 0px;
  animation-name: ${modalFade};
  transform: translate(0, 0);
  transition: ${modalFade} 0.3s ease-out;
  animation-duration: 0.5s;
  z-index: 1072;
  position: relative;
  width: auto;
  border: 0;
`;

const MyModalHeader = styled.div`
  display: flex;
  padding: 1.25rem;
  border-bottom: 1px solid #e9ecef;
  border-top-left-radius: 0.3rem;
  border-top-right-radius: 0.3rem;
  align-items: flex-start;
  justify-content: space-between;
`;

const MyModalBody = styled.div`
  position: relative;
  padding: 1.5rem;
  flex: 1 1 auto;
`;

const MyModalFooter = styled.div`
  display: flex;
  padding: 1.5rem;
  border-top: 1px solid #e9ecef;
  align-items: center;
  justify-content: flex-end;
`;

const ModalTitle = styled.h3`
  margin-bottom: 0;
  margin-top: 0;
`;

const CloseButton = styled.div`
  letter-spacing: 1.5px;
`;

const Content = styled.p``;

class Modal extends Component {
  constructor() {
    super();
    this.state = {
      isOpen: false
    };
  }

  toggle() {
    const isShowed = !this.props.show;
    this.props.toggle(isShowed);
  }

  render() {
    return (
      <div>
        {this.props.show ? (
          <ModalParent>
            <MyModal>
              <MyModalHeader>
                <ModalTitle>This is the header of the modal</ModalTitle>
                <Icon
                  icon={'close'}
                  width={10}
                  height={18}
                  onClick={() => this.toggle()}
                />
              </MyModalHeader>
              <MyModalBody>
                <Content>
                  jaosfojas faihsf asjf aos fajso fao sfo jasfja josfoja sfoasj
                  of asfoj asof aojsfoas fjoas foasjof aos foja sfoja sfo asfoj
                  asof asof asojf
                </Content>
              </MyModalBody>
              <MyModalFooter>
                <CloseButton onClick={() => this.toggle()}>CLOSE</CloseButton>
              </MyModalFooter>
            </MyModal>
          </ModalParent>
        ) : null}
      </div>
    );
  }
}

export default Modal;
