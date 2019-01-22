import React from 'react';
import bs58 from 'bs58';
import web3 from 'web3';
import sha256 from 'sha256';
import {NUMBER_OF_CHECKSUM_BYTES} from '../webpack/components/UserLookup/ChecksumParameters.js';

export const bs58encode = value => {
  if (value.includes('0x') && web3.utils.isAddress(value)) {
    let address = new Buffer(value.replace('0x', '').toString(), 'hex');
    let hash = new Buffer(sha256(sha256(address)));
    let checksum = hash.slice(0, NUMBER_OF_CHECKSUM_BYTES);
    let addressAndChecksum = Buffer.concat([address, checksum]);
    return bs58.encode(addressAndChecksum);
  }
  return null;
};

export const bs58decode = () => {};
