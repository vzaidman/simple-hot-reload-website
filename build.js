import * as babel from "@babel/core";
import fs from 'fs';

if (!fs.existsSync('./build')) {
    fs.mkdirSync('./build');
}

fs.copyFileSync('./client/index.html', './build/index.html');

// reset helper.js to be not hot reloaded
fs.copyFileSync('./helper-versions/helper.0.js', './client/helper.js');

function transform({src, dest, sourceFileName, enableSourcesContent}) {
    const {code, map} = babel.transformFileSync(src, {
        sourceMaps: true,
        presets: ['@babel/preset-env']
    });

    if (!enableSourcesContent) {
        map.sourcesContent = [null];
    }

    map.sources = [sourceFileName];

    // write transpiled file
    fs.writeFileSync(dest, `${code}\n//# sourceMappingURL=../${dest}.map`);

    // write map
    fs.writeFileSync(`${dest}.map`, JSON.stringify(map, null, 4));
}

// prepare initial bundles
fs.readdirSync('./client')
    .filter(fileName => fileName.endsWith('.js'))
    .forEach(fileName => transform({
        fileName,
        src: `client/${fileName}`,
        dest: `build/${fileName}`,
        sourceFileName: `/client/${fileName}`,
        enableSourcesContent: false
    }));

// prepare hot reloaded bundles with source content
fs.readdirSync('./helper-versions')
    .map(fileName => transform({
        fileName,
        src: `helper-versions/${fileName}`,
        dest: `build/${fileName}`,
        sourceFileName: '/client/helper.js', // the hot reloads are for helper.js
        enableSourcesContent: true
    }));

// prepare hot reloaded bundles without source content
fs.readdirSync('./helper-versions')
    .map(fileName => transform({
        fileName,
        src: `helper-versions/${fileName}`,
        dest: `build/${fileName}.no-sources-content.js`,
        sourceFileName: '/client/helper.js', // the hot reloads are for helper.js
        enableSourcesContent: false
    }));