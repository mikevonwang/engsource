const fs = require('fs');
const XmlStream = require('xml-stream');
const ProgressBar = require('progress');

const tick = 1000;
let count = 0;

console.log('');
process.on('uncaughtException', (error) => {
   console.dir(error);
   console.log('');
});

if (process.argv.length < 3) {
  console.error('\x1b[31mERR!\x1b[0m Make sure to run this command with the file path to the Wiktionary XML file, e.g. `npm run split ./foo.xml`.');
  console.log('');
  return;
}

if (!fs.existsSync('./entries')) {
  fs.mkdirSync('./entries');
}

const stream = fs.createReadStream(process.argv[2]);
const xml = new XmlStream(stream);

const bar = new ProgressBar('working... [:bar] :rate/wps :percent :etas', {
  width: 30,
  incomplete: ' ',
  total: 770000,
});

xml.on('endElement: page', (page) => {

  if (page.ns === '0' && page.title.indexOf(' ') === -1 && page.title.length < 30) {
    if (page.revision.text.$text.indexOf('==English==') > -1) {
      count++;
      if (count % tick === 0) {
        bar.tick(tick);
      }
      fs.writeFileSync(`./entries/${page.id}.json`, JSON.stringify({
        title: page.title,
        id: page.id,
        text: page.revision.text.$text,
      }));
    }
  }

});
xml.on('end', () => {
  console.log('done!\n');
});
