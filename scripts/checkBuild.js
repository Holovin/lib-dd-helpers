const chalk = require('chalk');
const shell = require('shelljs');

if (!shell.which('git')) {
    shell.exit(1);
}

const libFiles = [];
const gitTrackedFiles = shell.exec('git diff --name-only --diff-filter=ACM', { silent:true })
    .stdout
    .toString()
    .split(/\r?\n/);

const gitUntrackedFiles = shell.exec('git ls-files -o', { silent:true })
    .stdout
    .toString()
    .split(/\r?\n/);

libFiles.push(...gitTrackedFiles, ...gitUntrackedFiles);

for (const file of libFiles) {
    if (file.startsWith('lib/')) {
        shell.echo(file);

        shell.echo(`\n         ${chalk.red.bold('Compiled lib files are not added to commit, need fix it')}\n`);
        shell.exit(2);
    }
}

shell.echo(`\n         ${chalk.green.bold('All build files added...')} \n`);
shell.exit(0);
