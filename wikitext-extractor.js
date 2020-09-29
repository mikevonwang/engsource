const fs = require('fs');
const ProgressBar = require('progress');

const { getEnglishContent, getEntryFromKeys } = require('./utilities.js');

const tick = 5000;

let dictionary = {};

console.log('');
process.on('uncaughtException', (error) => {
   console.dir(error);
   console.log('');
});

if (!fs.existsSync('./entries')) {
  console.error('\x1b[31mERR!\x1b[0m The folder "./entries" doesn’t exist. Make sure to run the splitting script first.');
  console.log('');
  return;
}

const files = fs.readdirSync('./entries');
const bar = new ProgressBar('working... [:bar] :rate/wps :percent :etas', {
  width: 30,
  incomplete: ' ',
  total: files.length,
});

for (let i=0; i<files.length; i++) {
  let entry;
  const data = JSON.parse(fs.readFileSync(`./entries/${files[i]}`, 'utf8'));
  const englishContent = getEnglishContent(data.text);

  const keys = englishContent.match(/\{\{.+?\}\}/g)
  if (keys) {
    entry = getEntryFromKeys(keys);
  }

  if (entry) {
    dictionary[data.title] = entry;
  }

  if (i % tick === 0) {
    bar.tick(tick);
  }
}

console.log('writing to "./results.json"...');
fs.writeFileSync(`./results.json`, JSON.stringify(dictionary));
console.log('done!\n');

module.exports = {
  getEnglishContent,
  getEntryFromKeys,
};
