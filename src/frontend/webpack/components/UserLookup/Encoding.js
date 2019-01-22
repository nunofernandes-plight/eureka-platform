import React, {Component, Fragment} from 'react';
import styled from 'styled-components';
import web3 from 'web3';
import {__FIFTH, __GRAY_200} from '../../../helpers/colors';
import bs58 from 'bs58';
import animationData from '../../views/lottieAnimations/base58.json';
import sha256 from 'sha256';
import {InputField} from '../../design-components/Inputs.js';
import AuthorLookup from '../AuthorLookup.js';
import LottieManager from '../LottieManager.js';
import EncodingResult from './EncodingResult.js';
import {NUMBER_OF_CHECKSUM_BYTES} from './ChecksumParameters.js';
import {bs58encode} from '../../../helpers/base58.js';

const Container = styled.div``;

export const ConvertButton = styled.div`
  transition: 0.3s all ease-in-out;
  opacity: ${props => (props.status === 'valid' ? 1 : 0.5)};
  cursor: ${props => (props.status === 'valid' ? 'pointer' : 'default')};
  pointer-events: ${props => (props.status === 'valid' ? 'default' : 'none')};
  color: ${__FIFTH};
  text-transform: uppercase;
  border: ${props =>
    props.status === 'valid'
      ? `1px solid ${__FIFTH}`
      : `1px solid ${__GRAY_200}`};
  border-radius: 4px;
  padding: 4px 12px;
`;

export const ConvertContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 20px;
`;

const Label = styled.label`
  font-size: 15px;
  font-weight: bold;
`;

class Encoding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
      address: props.address,
      encodedAddress: null,
      isConverting: false
    };
  }

  componentDidMount() {
    this.checkStatus(this.state.address);
  }

  checkStatus(value) {
    if (this.state.encodedAddress) {
      this.setState({encodedAddress: null});
    }
    if (web3.utils.isAddress(value)) {
      this.setState({status: 'valid', address: value});
    } else return this.setState({status: 'error', address: value});
  }

  async encode() {
    this.setState({
      encodedAddress: bs58encode(this.state.address),
      isConverting: true
    });
  }

  render() {
    return (
      <Container>
        <Label>Ethereum Address</Label>
        <InputField
          value={this.state.address}
          onChange={e => {
            this.checkStatus(e.target.value);
          }}
          status={this.state.status}
          placeholder={'0xab5801a7d398351b8be11c439e05c5b3259aec9b'}
        />
        {this.state.status === 'valid' ? (
          <AuthorLookup
            addresses={this.state.address}
            right={10}
            width={35}
            height={35}
            fontSize={12}
            padding={'12px'}
          />
        ) : null}
        <ConvertContainer>
          <ConvertButton
            status={this.state.status}
            onClick={async () => {
              await this.encode();
            }}
          >
            Encode
            <LottieManager
              animationData={animationData}
              onComplete={() => {
                this.setState({isConverting: false});
              }}
              loop={false}
              autoplay={false}
              isPaused={!this.state.isConverting}
              width={30}
            />
          </ConvertButton>
        </ConvertContainer>

        {this.state.encodedAddress ? (
          <Fragment>
            <EncodingResult
              encodedAddress={this.state.encodedAddress}
              ethAddress={this.state.address}
            />
          </Fragment>
        ) : null}
      </Container>
    );
  }
}

export default Encoding;
