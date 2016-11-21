'use strict';

module.exports = {
  buildView,
  getView
};

const _ = require('lodash');
const config = require('./config');
const s3 = require('./s3');
const template = require('./template');

function buildView() {
  return s3.loadObjects(`shamvelo-${config.environment}-athlete`)
    .map(JSON.parse)
    .toArray()
    .map(athletes => _.sortBy(athletes, 'name'))
    .flatMap(renderView)
    .flatMap(content =>
      s3.uploadIfChanged(`shamvelo-${config.environment}-view`, 'home', content)
    )
    .map(() => {});
}

function renderView(athletes) {
  return template.render('home', { athletes });
}

function getView() {
  return s3.getObject(`shamvelo-${config.environment}-view`, 'home');
}
