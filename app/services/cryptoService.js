'use strict';

const aesjs = require('aes-js');
const notp = require('notp');

function currentTimeBasedCode(key) {
  const code = notp.totp.gen(key);
  return code;
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

function getInt64Bytes(integer) {
  const bytes = [];
  let i = 8;
  let x = integer;
  do {
    bytes[--i] = x & (255);
    x = x >> 8;
  } while (i);
  return bytes;
}

function generateTimeBasedKey(key) {
  const newKey = xor(key, getInt64Bytes(currentTimeBasedCode(key)));
  return newKey;
}

const encrypt = function(key, iv, message) {
  const textBytes = aesjs.utils.utf8.toBytes(message);
  const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv); // eslint-disable-line
  const encryptedBytes = aesCbc.encrypt(textBytes);
  const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
  return encryptedHex;
};

const decrypt = function(key, iv, encryptedHex) {
  const encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);
  const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv); // eslint-disable-line
  const decryptedBytes = aesCbc.decrypt(encryptedBytes);
  const decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
  return decryptedText;
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
