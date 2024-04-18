import CryptoJS from 'crypto-js';

export const encryptByAES = (text) => {
  const message = CryptoJS.enc.Utf8.parse(text);
  const encryptKey = import.meta.env.VITE_ENCRYPT_KEY;
  const secretPassphrase = CryptoJS.enc.Utf8.parse(encryptKey);
  const iv = CryptoJS.enc.Utf8.parse('0000000000000000');

  const encrypted = CryptoJS.AES.encrypt(message, secretPassphrase, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    iv,
  }).toString();

  return encrypted;
};
