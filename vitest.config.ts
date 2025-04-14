import path from 'path'

export default {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '~': path.resolve(__dirname, './'),
    },
  },
}
