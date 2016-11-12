'use strict';

const fs = require('fs');
const Handlebars = require('handlebars');
const path = require('path');
const Rx = require('rx');

const readFile = Rx.Observable.fromNodeCallback(fs.readFile);

module.exports.create = render;

function render(templateName, content) {
  return readFile(path.join(__dirname, templateName + '.handlebars'), 'utf8')
    .map(templateSource => Handlebars.create().compile(templateSource))
    .map(template => template(content));
}
