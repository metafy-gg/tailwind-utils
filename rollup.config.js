import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.js',
  plugins: [commonjs()],
  output: {
    file: 'dist/bundle/index.js',
    format: 'cjs',
  },
};
