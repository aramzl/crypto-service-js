'use strict';

const expect = require('chai').expect;
const cryptoService = require('../../app/services/cryptoService');

const key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
const iv = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('crypto-service', () => {
  it('encode/decode aes', done => {
    const message = 'Hello world!!!!!';
    const encrypted = cryptoService.encrypt(key, iv, message);
    expect(encrypted).not.to.equal(message);
    const decrypted = cryptoService.decrypt(key, iv, encrypted);
    expect(decrypted).to.be.equal(message); // eslint-disable-line
    done();
  });

  it('encode/decode aes time based', function(done) {
    this.timeout(50000);
    const message = 'Hello world!!!!!';
    const encrypted = cryptoService.encryptTimeBased(key, iv, message);
    expect(encrypted).not.to.equal(message);
    const decrypted = cryptoService.decryptTimeBased(key, iv, encrypted);
    expect(decrypted).to.be.equal(message);
    sleep(31000).then(() => {
      const encrypted2 = cryptoService.encryptTimeBased(key, iv, message);
      expect(encrypted2).not.to.equal(message);
      const decrypted2 = cryptoService.decryptTimeBased(key, iv, encrypted2);
      expect(decrypted2).to.be.equal(message);
    }).then(() => done());
  });

  it('encode/decode failed after 30 sec aes time based', function(done) {
    this.timeout(50000);
    const message = 'Hello world!!!!!';
    const encrypted = cryptoService.encryptTimeBased(key, iv, message);
    expect(encrypted).not.to.equal(message);
    const decryptedOk = cryptoService.decryptTimeBased(key, iv, encrypted);
    expect(decryptedOk).to.be.equal(message);
    sleep(31000)
      .then(() => {
        const decrypted = cryptoService.decryptTimeBased(key, iv, encrypted);
        expect(decrypted).not.to.be.equal(message);
      })
      .then(() => done())
      .catch((err) => done(err));
  });

  it('encodes/decodes with string key', function(done) {
    this.timeout(50000);
    const keyBytes = cryptoService.getStrBytes('mykey12345678901');
    const ivBytes = cryptoService.getStrBytes('1234567890123456');
    const message = 'Hello world!!!!!';
    const encrypted = cryptoService.encryptTimeBased(keyBytes, ivBytes, message);
    expect(encrypted).not.to.equal(message);
    const decrypted = cryptoService.decryptTimeBased(keyBytes, ivBytes, encrypted);
    expect(decrypted).to.be.equal(message);
    done();
  });
});
