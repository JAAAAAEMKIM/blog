const path = require('path');
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  entry: 'src/index.js',
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/], 
          transpileOnly: true 
        }
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            // options: {
            //   loaders: {
            //     js: 'babel-loader',
            //     options: {
            //       cacheDirectory: true
            //     }
            //   }
            // }
          },
        ]
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    // you are using run-time only ... 에러 대응
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.resolve('src/'),
    },
    preferRelative: true,
    extensions: ['.ts', '.js', '.vue', '.json', '...']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  plugins: [
    // make sure to include the plugin!
    // js에 적용돼야하는 설정들을 vue의 <script>태그 내에서도 적용되게 해줌.
    new VueLoaderPlugin()
  ],
}