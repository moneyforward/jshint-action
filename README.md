# Code review using JSHint

Analyze code statically by using [JSHint](https://jshint.com/) in Github actions

## Inputs

### `files`

Specify files or directories

(Multiple files or directories can be specified by separating them with line feed)

### `options`

Changes `jshint` command line options.

Specify the options in JSON array format.
e.g.: `'["--extra-ext", ".js"]'`

### `working_directory`

Changes the current working directory of the Node.js process

### `reporter_type_notation`

Change the reporter.

(Multiple can be specified separated by commas)

## Example usage

```yaml
name: Analyze code statically
"on": pull_request
jobs:
  jshint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Analyze code statically using JSHint
        uses: moneyforward/jshint-action@v0
```

## Contributing
Bug reports and pull requests are welcome on GitHub at https://github.com/moneyforward/jshint-action

## License
The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
