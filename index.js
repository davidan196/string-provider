const bcrypt = require("bcrypt");
const crypto = require("crypto");

function genString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

function randomUidString(bytesLength) {
  return crypto.randomBytes(bytesLength).toString("hex");
}

function removeQueryStringAndHash(url) {
  const urlObj = new URL(url);

  urlObj.search = '';
  urlObj.hash = '';

  return urlObj.toString();
}

function hashStringAsync(intput, salt = 10) {
    return bcrypt.hash(intput, salt);
}

function commparePasswordAsync(rawPass, hashPass) {
    return bcrypt.compare(rawPass, hashPass)
}

module.exports = {
    genString,
    randomUidString,
    removeQueryStringAndHash,
    hashStringAsync,
    commparePasswordAsync
}

