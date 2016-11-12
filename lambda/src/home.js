'use strict';

module.exports = {
  buildView
};

const _ = require('lodash');
const config = require('./config');
const s3 = require('./s3');
const template = require('./src/template');

function buildView() {
  return s3.loadObjects(`shamvelo-${config.environment}-athlete`)
    .toArray()
    .map(athletes => _.sort(athletes, athletes.name))
    .map(renderView)
    .flatMap(content => s3.upload(`shamvelo-${config.environment}-view`, 'home', content));
}

function renderView(athletes) {
  return template.render('home', athletes);
}
