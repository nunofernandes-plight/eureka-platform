import React, {Component, Fragment} from 'react';
import styled from 'styled-components';
import bs58 from 'bs58';
import web3 from 'web3';
import animationData from '../../views/lottieAnimations/base58.json';
import {ConvertButton, ConvertContainer} from './Encoding';
import sha256 from 'sha256';
import {EndPrefix, InitialPrefix} from '../../constants/Prefix.js';
import {InputField} from '../../design-components/Inputs.js';
import {ALLOWED_CHARACTERS_BS58} from '../../constants/Base58Characters.js';
import LottieControl from '../LottieManager.js';
import DecodingResult from './DecodingResult.js';
import {NUMBER_OF_CHECKSUM_BYTES} from './ChecksumParameters.js';
import {bs58decode, isCheckSum} from '../../../helpers/base58.js';

const Container = styled.div``;
const Label = styled.label`
  font-size: 15px;
  font-weight: bold;
`;

class Decoding extends Component {
  constructor() {
    super();
    this.state = {
      status: null,
      ekaAddress: null,
      decodedAddress: null,
      isConverting: false
    };
  }

  componentDidMount() {}

  checkStatus(value) {
    // remove prefix EKA is it is in there
    value = value.includes(InitialPrefix)
      ? value.substr(InitialPrefix.length)
      : value;
    if (isCheckSum(value)) {
      this.setState({status: 'valid', ekaAddress: value});
    } else {
      this.setState({status: 'error', ekaAddress: value});
    }
  }

  decode() {
    this.setState({
      isConverting: true,
      decodedAddress: bs58decode(this.state.ekaAddress)
    });
  }

  render() {
    return (
      <Container>
        <Label>EKA Address</Label>
        <InputField
          onChange={e => {
            this.checkStatus(e.target.value);
          }}
          status={this.state.status}
          placeholder={'EKA3PTEBL6UqrZn1zJNxgewtbUQ5UNWxy'}
        />
        <ConvertContainer>
          <ConvertButton
            status={this.state.status}
            onClick={async () => {
              await this.decode();
            }}
          >
            Decode
            <LottieControl
              animationData={animationData}
              onComplete={() => {
                this.setState({isConverting: false});
              }}
              isPaused={!this.state.isConverting}
              width={30}
            />
          </ConvertButton>
        </ConvertContainer>

        {this.state.decodedAddress ? (
          <Fragment>
            <DecodingResult
              decodedAddress={this.state.decodedAddress}
              ekaAddress={this.state.ekaAddress}
            />
          </Fragment>
        ) : null}
      </Container>
    );
  }
}

export default Decoding;
