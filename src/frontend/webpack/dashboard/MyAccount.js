import React from 'react';
import styled from 'styled-components';
import {Row} from '../../helpers/layout.js';
import {TopContainer} from './TopContainer.js';
import {__THIRD} from '../../helpers/colors.js';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const CardContainer = Row.extend`
  transition: all 0.15s ease;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  word-wrap: break-word;
  border: 0.0625rem solid rgba(0, 0, 0, 0.05);
  border-radius: 0.25rem;
  background-color: #ffffff;
  background-clip: border-box;
  min-height: 420px;
  min-width: 800px;
  box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07) !important;
  margin-top: -180px !important;
`;

const PhotoContainer = styled.div`
  &:hover {
    opacity: 0.4;
  }
  position: relative;
  transition: all 0.15s ease;
`;

const Photo = styled.img`
  position: absolute;
  left: 50%;
  max-width: 180px;
  transition: all 0.15s ease;
  transform: translate(-50%, -30%);
  border-radius: 0.25rem;
`;

const Email = styled.div`
  font-family: inherit;
  font-weight: 400;
  line-height: 1.3;
  font-size: 1.75rem;
  color: ${__THIRD};
`;

const ProfileRow = styled.div`
  display: flex;
  justify-content: center;
  margin: 10px 0;
`;

const EmailContainer = ProfileRow.extend`
  margin-top: 9rem;
`;

const EthereumAddress = styled.div`
  color: ${__THIRD};
  font-weight: 300 !important;
  font-size: 1rem;
`;

const MyAccount = props => {
  return (
    <Container>
      <TopContainer />
      <CardContainer>
        <Card>
          <PhotoContainer>
            <Photo src={'/' + props.user.avatar} />
          </PhotoContainer>
          <EmailContainer>
            <Email>{props.user.email}</Email>
          </EmailContainer>
          <ProfileRow style={{margin: 0}}>
            <EthereumAddress>{props.user.ethereumAddress}</EthereumAddress>
          </ProfileRow>
        </Card>
      </CardContainer>
    </Container>
  );
};

export default MyAccount;
