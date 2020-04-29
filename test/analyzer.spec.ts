import { expect } from 'chai';
import stream from 'stream';
import { Transformers } from '@moneyforward/sca-action-core';
import Analyzer from '../src/analyzer'
import { AssertionError } from 'assert';

describe('Transform', () => {
  it('should return the problem object', async () => {
    const expected = {
      file: 'public/vendor/sinon-1.17.5.js',
      line: '672',
      column: '523',
      severity: 'Error',
      message: `Expected an identifier and instead saw '='. (E030)`,
      code: 'E030'
    };
    const text = `public/vendor/sinon-1.17.5.js:672:523: Expected an identifier and instead saw '='. (E030)`;
    const analyzer = new (class extends Analyzer {
      public constructor() {
        super();
      }
      public createTransformStreams(): Transformers {
        return super.createTransformStreams();
      }
    })();
    const [prev, next = prev] = analyzer.createTransformStreams();
    stream.Readable.from(text).pipe(prev);
    for await (const problem of next) {
      expect(problem).to.deep.equal(expected);
      return;
    }
    throw new AssertionError({ message: 'There was no problem to expect.', expected });
  });
});
