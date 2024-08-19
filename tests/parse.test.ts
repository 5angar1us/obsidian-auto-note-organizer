
import * as _chai from 'chai';

import { expect } from 'chai';

import { parseTest } from '../src/utils/RuleProcessor';


_chai.should();

_chai.expect;

  

describe('parseTest', () => {

  it('should parse correctly when given a number with commas', () => {

    const result = parseTest('something[653,35]');

    expect(result).to.deep.equal({ parameter: 'something', value: '653,35' });

  });

  

  it('should parse correctly when given a string in brackets', () => {

    const result = parseTest('somethingElse[else]');

    expect(result).to.deep.equal({ parameter: 'somethingElse', value: 'else' });

  });

  

  it('should return error format when input does not match the regex', () => {

    const result = parseTest('invalidInput');

    expect(result).to.deep.equal({ parameter: '!!!', value: 'nfg' });

  });

  

  it('should handle edge cases with numbers', () => {

    const result = parseTest('edgeCase[1]');

    expect(result).to.deep.equal({ parameter: 'edgeCase', value: '1' });

  });

  

  it('should handle edge cases with strings', () => {

    const result = parseTest('edgeCase[a]');

    expect(result).to.deep.equal({ parameter: 'edgeCase', value: 'a' });

  });

  

  it('should not match if the parameter contains non-word characters', () => {

    const result = parseTest('some-thing[653,35]');

    expect(result).to.deep.equal({ parameter: '!!!', value: 'nfg' });

  });

  

  it('should not match if the value contains non-word or non-digit characters', () => {

    const result = parseTest('something[653,35!]');

    expect(result).to.deep.equal({ parameter: '!!!', value: 'nfg' });

  });

  

  it('should not match if brackets are not properly closed', () => {

    const result = parseTest('something[653,35');

    expect(result).to.deep.equal({ parameter: '!!!', value: 'nfg' });

  });

  

  it('should match if the string in brackets starts with a letter', () => {

    const result = parseTest('something[abc123]');

    expect(result).to.deep.equal({ parameter: 'something', value: 'abc123' });

  });

});