'use strict';

module.exports = {
  buildView
};

const config = require('./config');
const s3 = require('./s3');
const template = require('./template');

function buildView(athleteId) {
  return s3.getObject(`shamvelo-${config.environment}-athlete`, athleteId)
    .map(object => JSON.parse(object.toString()))
    .flatMap(renderView)
    .flatMap(content => s3.upload(`shamvelo-${config.environment}-view`, `athlete/${athleteId}`, content))
    .map(() => {});
}

function renderView(athlete) {
  return template.render('athlete', { athlete });
}