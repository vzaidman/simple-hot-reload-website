import express from 'express';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();
app.use(express.json());

function hotreload(version = 0) {
  fs.copyFileSync(`helper-versions/helper.${version}.js`, `client/helper.js`);
}

app.post('/hotreload', (req, res) => {
  hotreload(req.body.version);
  res.sendStatus(200);
});

app.use('/build', express.static('build'));
app.use('/client', express.static('client'));

app.get('/', (req, res) => {
  hotreload();
  res.sendFile(`${__dirname}/build/index.html`);
});

app.listen(3000, function () {
  console.log('listening on port 3000!');
});