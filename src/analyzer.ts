import stream from 'stream';
import util from 'util';
import { StaticCodeAnalyzer, Transformers, tool } from '@moneyforward/sca-action-core';

const debug = util.debuglog('jshint-action');

export default class Analyzer extends StaticCodeAnalyzer {
  constructor(options: string[] = []) {
    super('npx', ['jshint'].concat(options).concat(['--reporter', 'unix', '--verbose']), undefined, 3, undefined, 'JSHint', exitStatus => exitStatus === 0 || exitStatus === 2);
  }

  protected async prepare(): Promise<unknown> {
    return Promise.resolve();
  }

  protected createTransformStreams(): Transformers {
    const transformers = [
      new tool.LineTransformStream(),
      new stream.Transform({
        readableObjectMode: true,
        writableObjectMode: true,
        transform: function (warning: string, _encoding, done): void {
          debug('%s', warning);
          const regex = /^(.+):(\d+):(\d+): (.+) \(((?:E|W|I)\d+)\)$/;
          const [matches, file, line, column, message, code] = regex.exec(warning) || [];
          done(null, matches && {
            file,
            line,
            column,
            message: `${message}${code ? ` (${code})` : ''}`,
            severity: code.startsWith('E') ? 'Error' : 'Warning',
            code
          });
        }
      })
    ];
    transformers.reduce((prev, next) => prev.pipe(next));
    return [transformers[0], transformers[transformers.length - 1]];
  }
}
