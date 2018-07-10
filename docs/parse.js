var plantuml = require('node-plantuml');
var fs = require('fs');

var gen = plantuml.generate(__dirname + "/components.pu",{ format: 'png' });
gen.out.pipe(fs.createWriteStream(__dirname + "/components.png"));