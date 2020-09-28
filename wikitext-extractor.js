const fs = require('fs');
const ProgressBar = require('progress');

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

function getEnglishContent(text) {
  const R1 = /==(\w+?)== /g;
  let snippet;
  let match;
  let a;
  let b;
  while (!snippet && match !== null) {
    match = R1.exec(text);
    if (match) {
      if (match[1] === 'English' && isNaN(a)) {
        a = match.index;
      }
      else if (!isNaN(a)) {
        b = match.index;
      }
    }
    else {
      if (isNaN(a)) {
        break;
      }
      else {
        b = Infinity;
      }
    }
    if (!isNaN(a) && !isNaN(b)) {
      snippet = text.substring(a,b);
    }
  }
  return snippet;
}

function getEntryFromKeys(keys) {
  let entry;
  for (let i=0; i<keys.length; i++) {
    const parts = keys[i].substring(2, keys[i].length-2).split('|')
    switch (parts[0]) {
      case 'inherited':
      case 'inh':
      case 'derived':
      case 'der':
      case 'borrowed':
      case 'bor':
        if (parts[2] !== 'enm') { // middle english
          entry = {ety: parts[2]};
        }
      break;
      case 'etyl':
        if (parts[1] !== 'enm') { // middle english
          entry = {ety: parts[1]};
        }
      break;
      case 'suffix':
      case 'suf':
        if (parts[2]) {
          entry = {lemma: parts[2]}
        }
      break;
      case 'prefix':
      case 'pre':
        if (parts[3]) {
          entry = {lemma: parts[3]}
        }
      break;
      case 'affix':
      case 'af': {
        const potentialEntry = parts.slice(2).find(part => part.indexOf('-') === -1);
        if (potentialEntry) {
          entry = {lemma: potentialEntry}
        }
      }
      break;
      case 'compound':
        entry = {lemma: parts[parts.length-1]}
      break;
      case 'plural of':
      case 'clipping of':
      case 'present participle of':
      case 'en-past of':
      case 'en-simple past of':
      case 'en-third-person singular of':
      case 'inflection of':
        if (parts[1] !== 'en') {
          entry = {lemma: parts[1]};
        }
        else {
          entry = {lemma: parts[2]};
        }
      break;
    }
    if (entry) {
      break;
    }
  }
  return entry;
}
