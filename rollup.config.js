export default {
  input: './src/index.js',
  output: [
    {
      format: 'umd',
      name: 'dxCart',
      file: './dist/index.umd.js'
    },
    {
      format: 'esm',
      file: './dist/index.es.js',
      sourcemap: true
    }
  ]
}