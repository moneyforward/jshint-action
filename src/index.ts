import stream from 'stream';
import util from 'util';
import StaticCodeAnalyzer, { AnalyzerConstructorParameter } from '@moneyforward/sca-action-core';
import { transform } from '@moneyforward/stream-util';

const debug = util.debuglog('@moneyforward/code-review-action-jshint-plugin');

export default class Analyzer extends StaticCodeAnalyzer {
  constructor(...args: AnalyzerConstructorParameter[]) {
    super('npx', ['jshint'].concat(args.map(String)).concat(['--reporter', 'unix', '--verbose']), undefined, exitStatus => exitStatus === 0 || exitStatus === 2, undefined, 'JSHint');
  }

  protected prepare(): Promise<void> {
    return Promise.resolve();
  }

  protected createTransformStreams(): stream.Transform[] {
    return [
      new transform.Lines(),
      new stream.Transform({
        objectMode: true,
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
  }
}
