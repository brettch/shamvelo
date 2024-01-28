import { Identified, mapById } from './identified.js';

interface IdentifiedString extends Identified {
  field1: string,
}

test('no objects', () => {
  const data: IdentifiedString[] = [];
  expect(mapById(data)).toEqual(new Map());
});

test('one object', () => {
  const data: IdentifiedString[] = [{id: 1234, field1: 'field1Value'}];
  expect(
    mapById(data)
  ).toEqual(new Map([
    [1234, data[0]]
  ]));
});

test('two objects', () => {
  const data: IdentifiedString[] = [
    {id: 1234, field1: 'field1Value'},
    {id: 2345, field1: 'field2Value'}
  ];
  expect(
    mapById(data)
  ).toEqual(new Map([
    [1234, data[0]],
    [2345, data[1]],
  ]));
});
