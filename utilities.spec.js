const fs = require('fs');

const { getEnglishContent, getEntryFromKeys } = require('./utilities.js');

if (process.argv.length < 3) {
  console.error('\x1b[31mERR!\x1b[0m Make sure to run this command with the Wiktionary Page ID of the entry you want to examine, e.g. `npm test 16`.');
  console.log('');
  return;
}

const data = JSON.parse(fs.readFileSync(`./entries/${process.argv[2]}.json`, 'utf8'));

const englishContent = getEnglishContent(data.text);

const keys = englishContent.match(/\{\{.+?\}\}/g)
if (keys) {
  entry = getEntryFromKeys(keys);
}
console.log(entry);
console.log('\n');
