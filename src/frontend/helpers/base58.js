import React from 'react';
import bs58 from 'bs58';
import web3 from 'web3';
import sha256 from 'sha256';
import {NUMBER_OF_CHECKSUM_BYTES} from '../webpack/components/UserLookup/ChecksumParameters.js';
import {ALLOWED_CHARACTERS_BS58} from '../webpack/constants/Base58Characters.js';

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

const areCharactersAllowedByBS58 = value => {
  let flat = true;
  for (let i = 0; i < value.length; i++) {
    const c = value.charAt(i).toString();
    if (!(ALLOWED_CHARACTERS_BS58.indexOf(c) > -1)) {
      // character is not in the array and thus is not a valid character
      flat = false;
    }
  }
  return flat;
};

export const isCheckSum = value => {
  if (!areCharactersAllowedByBS58(value)) {
    return false;
  }
  let flag = true;
  const buffer = new Buffer(bs58.decode(value));
  const address = buffer.slice(0, -NUMBER_OF_CHECKSUM_BYTES);
  const checksum = buffer.slice(-NUMBER_OF_CHECKSUM_BYTES);
  let hash = new Buffer(sha256(sha256(address)));
  checksum.forEach((digit, i) => {
    if (digit !== hash[i]) {
      flag = false;
    }
  });
  return flag;
};

export const bs58decode = value => {
  if (isCheckSum(value)) {
    const buffer = new Buffer(bs58.decode(value));
    const address = buffer.slice(0, -NUMBER_OF_CHECKSUM_BYTES).toString('hex');
    return web3.utils.toChecksumAddress('0x' + address);
  }
};
