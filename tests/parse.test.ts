import { describe, test, expect } from "@jest/globals"
import { parseTest } from '../src/utils/RuleProcessor';

describe('parseTest', () => {

    test('should parse correctly when given a number with commas', () => {
        const result = parseTest('something[653,35]');
        expect(result).toEqual({ parameter: 'something', value: '653,35' });
    });

    test('should parse correctly when given a string in brackets', () => {
        const result = parseTest('somethingElse[else]');
        expect(result).toEqual({ parameter: 'somethingElse', value: 'else' });
    });

    test('should return error format when input does not match the regex', () => {
        const result = parseTest('invalidInput');
        expect(result).toEqual({ parameter: '!!!', value: 'nfg' });
    });

    test('should handle edge cases with numbers', () => {
        const result = parseTest('edgeCase[1]');
        expect(result).toEqual({ parameter: 'edgeCase', value: '1' });
    });

    test('should handle edge cases with strings', () => {
        const result = parseTest('edgeCase[a]');
        expect(result).toEqual({ parameter: 'edgeCase', value: 'a' });
    });

    test('should not match if the parameter contains non-word characters', () => {
        const result = parseTest('some-thing[653,35]');
        expect(result).toEqual({ parameter: '!!!', value: 'nfg' });
    });

    test('should not match if the value contains non-word or non-digit characters', () => {
        const result = parseTest('something[653,35!]');
        expect(result).toEqual({ parameter: '!!!', value: 'nfg' });
    });

    test('should not match if brackets are not properly closed', () => {
        const result = parseTest('something[653,35');
        expect(result).toEqual({ parameter: '!!!', value: 'nfg' });
    });

    test('should match if the string in brackets starts with a letter', () => {
        const result = parseTest('something[abc123]');
        expect(result).toEqual({ parameter: 'something', value: 'abc123' });
    });

});