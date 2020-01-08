'use strict';

const mapById = require('../../src/leaderboard2/map-by-id');

test('no objects', () => {
  const data = [];
  expect(mapById(data)).toEqual({});
});

test('one object', () => {
  const data = [{id: 1234, field1: 'field1Value'}];
  expect(
    mapById(data)
  ).toEqual({
    1234: data[0]
  });
});

test('two objects', () => {
  const data = [
    {id: 1234, field1: 'field1Value'},
    {id: 2345, field2: 'field2Value'}
  ];
  expect(
    mapById(data)
  ).toEqual({
    1234: data[0],
    2345: data[1]
  });
});
