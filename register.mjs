import { register } from 'ts-node';

register({
  transpileOnly: true,
  project: './tsconfig.test.json',
});