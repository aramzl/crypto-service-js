'use strict';

const expect = require('chai').expect;
const cryptoService = require('../../app/services/cryptoService')

const key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
const iv = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,35, 36];

describe('crypto-service', () => {
  it('encode/decode aes', done => {
    const message = 'Hello world!!!!!';
    const encrypted = cryptoService.encrypt(key, iv, message);
    expect(encrypted).not.to.equal(message);
    const decrypted = cryptoService.decrypt(key, iv, encrypted);
    expect(decrypted).to.be.equal(message); // eslint-disable-line
    done();
  });
});
