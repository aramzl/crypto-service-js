'use strict';

const aesjs = require('aes-js');
const notp = require('notp');
const crypto = require('crypto');
const _ = require('lodash');

function createDigestedKey(key) {
  const hash = crypto.createHash('sha256')
    .update(new Buffer(key))
    .digest('hex');
  return aesjs.utils.hex.toBytes(hash);
}

function currentTimeBasedCode(key) {
  const bytes = createDigestedKey(key);
  return notp.totp.gen(bytes);
}

function xor(one, two) {
  if (one.length >= two.length) {
    const newOne = one.slice();
    for (let i = 0; i < two.length; i++) {
      newOne[i] ^= two[i];
    }
    return newOne;
  }
  const newTwo = one.slice();
  for (let i = 0; i < one.length; i++) {
    newTwo[i] ^= one[i];
  }
  return newTwo;
}

const getStrBytes = function(str) {
  function s(x) {
    return x.charCodeAt(0);
  }
  return str.split('').map(s);
};

function generateTimeBasedKey(key) {
  const code = currentTimeBasedCode(key);
  const strBytes = getStrBytes(code);
  const newKey = createDigestedKey(xor(createDigestedKey(key), strBytes));
  return _.map(newKey, (byte) => (byte < 0 ? byte + 256 : byte));
}

const encrypt = function(key, iv, message) {
  const textBytes = aesjs.utils.utf8.toBytes(message);
  const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv); // eslint-disable-line
  return aesCbc.encrypt(textBytes);
};

const decrypt = function(key, iv, encryptedBytes) {
  const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv); // eslint-disable-line
  const decryptedBytes = aesCbc.decrypt(encryptedBytes);
  return aesjs.utils.utf8.fromBytes(decryptedBytes);
};

const encryptTimeBased = function(key, iv, message) {
  const newKey = generateTimeBasedKey(key);
  return encrypt(newKey, iv, message);
};

const decryptTimeBased = function(key, iv, encryptedHex) {
  const newKey = generateTimeBasedKey(key);
  return decrypt(newKey, iv, encryptedHex);
};

module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;
module.exports.encryptTimeBased = encryptTimeBased;
module.exports.decryptTimeBased = decryptTimeBased;
module.exports.getStrBytes = getStrBytes;
