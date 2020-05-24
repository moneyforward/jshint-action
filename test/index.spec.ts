import { expect } from 'chai';
import stream from 'stream';
import { reporter } from '@moneyforward/code-review-action';
import Analyzer from '../src'
import { AssertionError } from 'assert';

type ReporterConstructor = reporter.ReporterConstructor;

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
      get Reporter(): ReporterConstructor {
        throw new Error("Method not implemented.");
      }
      public constructor() {
        super();
      }
      public createTransformStreams(): stream.Transform[] {
        return super.createTransformStreams();
      }
    })();
    const transform = analyzer.createTransformStreams()
      .reduce((previous, current) => previous.pipe(current), stream.Readable.from(text));
    for await (const problem of transform) return expect(problem).to.deep.equal(expected);
    throw new AssertionError({ message: 'There was no problem to expect.', expected });
  });
});
