import eslint from '@rollup/plugin-eslint'
import { babel } from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'
import filesize from 'rollup-plugin-filesize'

const pkg = require('./package.json')

// dev build if watching, prod build if not
const isProduction = !process.env.ROLLUP_WATCH
const minifyPlugin = isProduction ? [terser()] : []

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'umd',
      exports: 'default',
      name: 'MicroModal'
    },
    {
      file: pkg.cdn,
      format: 'umd',
      exports: 'default',
      name: 'MicroModal',
      plugins: minifyPlugin
    },
    {
      file: pkg.module,
      format: 'es',
      plugins: minifyPlugin
    },
    {
      file: 'dist/micromodal.cjs',
      format: 'cjs',
      exports: 'default',
      plugins: minifyPlugin
    }
  ],
  plugins: [
    eslint({ exclude: 'package.json' }),
    json(),
    babel({ exclude: 'node_modules/**', babelHelpers: 'bundled' }),
    isProduction && filesize()
  ].filter(Boolean)
}
