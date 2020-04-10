const { version } = require('../package.json');
const readline = require('readline');
import { validate, Type } from './instr';
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '>> ',
});

console.log(`Plavit Version: ${version}`);

let expression = '';
rl.prompt();
rl.on('line', (line: string) => {
  const endProgram = line.trim().slice(-1)[0] === ';';
  try {
    if (endProgram) {
      expression += line.trimEnd().slice(0, -1);
      console.log('Validation: ', validate(JSON.parse(expression)));
      expression = '';
      rl.setPrompt('>> ');
      rl.prompt();
    } else {
      rl.setPrompt('');
      expression += line;
    }
  } catch (e) {
    console.error(e);
    rl.close();
  }
}).on('close', () => {
  process.exit();
});
