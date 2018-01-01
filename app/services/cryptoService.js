'use strict';

const aesjs = require('aes-js');

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

module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;
