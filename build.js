import * as babel from "@babel/core";
import fs from 'fs';

if (!fs.existsSync('./build')) {
    fs.mkdirSync('./build');
}

fs.copyFileSync('./client/index.html', './build/index.html');

// reset helper.js to be not hot reloaded
fs.copyFileSync('./helper-versions/helper.0.js', './client/helper.js');

// prepare original bundles
fs.readdirSync('./client')
    .filter(fileName => fileName.endsWith('.js'))
    .map(fileName => ({
        fileName,
        ...babel.transformFileSync(`./client/${fileName}`, {
            sourceMaps: true,
            presets: ['@babel/preset-env']
        }),
    }))
    .forEach(({fileName, code, map}) => {
        fs.writeFileSync(`./build/${fileName}`, `${code}\n//# sourceMappingURL=${fileName}.map`);

        map.sources = [`/client/${fileName}`];

        fs.writeFileSync(`./build/${fileName}.map`, JSON.stringify(map, null, 4));
    });

// prepare hot reload bundles
fs.readdirSync('./helper-versions')
    .map(fileName => ({
        fileName,
        ...babel.transformFileSync(`./helper-versions/${fileName}`, {
            sourceMaps: true,
            presets: ['@babel/preset-env']
        }),
    }))
    .forEach(({fileName, code, map}) => {
        fs.writeFileSync(`./build/${fileName}`, `${code}\n//# sourceMappingURL=${fileName}.map`);

        map.sources = [`/client/helper.js`];
        map.sourcesContent = [null];

        fs.writeFileSync(`./build/${fileName}.map`, JSON.stringify(map, null, 4));
    });