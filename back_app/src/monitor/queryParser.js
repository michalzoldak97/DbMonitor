'use strict';

const restrictedWords = ['drop', 'update', 'insert'];

exports.parseQuery = rawText => {
  rawText = rawText.toLowerCase().replaceAll('/', ' ');
  restrictedWords.forEach(el => {
    rawText = rawText.replaceAll(el, '');
  });
  return `SELECT ${rawText}`;
};
