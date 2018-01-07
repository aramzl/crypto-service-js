# crypto-service-js

Combining [AES](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) with [TOTP](https://en.wikipedia.org/wiki/Time-based_One-time_Password_Algorithm) 
for a more secure AES encryption. (js implementation)


## Getting started

* Using Timebase algorithm from https://github.com/guyht/notp
* Using AES encryption from https://github.com/ricmoo/aes-js

A new AES key is generated every 30 seconds with the TOTP algorithm.
The client needs the original AES key to decrypt the messages but the key-synchronization happens with the help of the TOTP.

### Usage

 ```
 const cryptoService = require('cryptoService'); 
 
 // a key could also be generate from a pass phrase
 const key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
 const iv = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]; 
 const message = 'Hello world!!!!!';
 const encrypted = cryptoService.encryptTimeBased(key, iv, message);
 const decrypted = cryptoService.decryptTimeBased(key, iv, encrypted);
 console.log(decrypted); // prints Hello world!!!!!
 ```
