/**
 * docs以下にある*.puファイルを${元のファイル名}.pngにパースする
 */

var plantuml = require('node-plantuml');
var fs = require('fs');

fs.readdir(__dirname, (err, files) =>{
    if (err) {
        throw err;
    }
    
    files
        .filter(f => /^.*\.pu$/.test(f))
        .forEach(f => {
            const gen = plantuml.generate(__dirname + '/' + f,{ format: 'png' });
            gen.out.pipe(fs.createWriteStream(__dirname + '/' + f + '.png'));
        });
});
