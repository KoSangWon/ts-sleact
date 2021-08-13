import path from 'path';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'; // hot-reloading을 위한 것
import webpack from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'; // ts 체킹과 webpack을 동시(병렬)에 돌아가게 함. 좀 더 빨라짐.
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const isDevelopment = process.env.NODE_ENV !== 'production';

// ts가 한번 변환해주고 그다음 webpack이 받아서 babel로 js 파일을 만들어준다.
const config: webpack.Configuration = {
  name: 'sleact', // webpack 이름 설정
  mode: isDevelopment ? 'development' : 'production', // 모드에 따라 다르게 설정
  devtool: isDevelopment ? 'eval' : 'hidden-source-map', // devtool 설정
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'], // babel이 처리할 확장자 목록
    alias: {
      // 절대경로를 위한 설정. 타입스크립트에서도 해줘야 하고, webpack에서도 해줘야 한다. 즉, 2곳에서 해줘야 한다. 타입스크립트 검사기는 tsconfig.json을 보고 검사하고, 웹팩은 이것을 보고 바꾼다.
      '@hooks': path.resolve(__dirname, 'hooks'),
      '@components': path.resolve(__dirname, 'components'),
      '@layouts': path.resolve(__dirname, 'layouts'),
      '@pages': path.resolve(__dirname, 'pages'),
      '@utils': path.resolve(__dirname, 'utils'),
      '@typings': path.resolve(__dirname, 'typings'),
    },
  },
  entry: {
    app: './client', // 진입점
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // ts나 tsx
        loader: 'babel-loader', // babel-loader가 js로 바꿔줌
        options: {
          presets: [
            [
              '@babel/preset-env', // 최신 문법으로 코딩을 하더라도 결과물을 어떤 브라우저에든 돌아가게 해줄 수 있다.
              {
                targets: { browsers: ['last 2 chrome versions'] }, // 해당 브라우저들을 지원하게 바꿔주겠다.
                debug: isDevelopment, //
              },
            ],
            '@babel/preset-react', // 리액트 코드 바꿔줌
            '@babel/preset-typescript', // ts 코드 바꿔줌
          ],
          env: {
            development: {
              plugins: [['@emotion', { sourceMap: true }], require.resolve('react-refresh/babel')], // hot-reloading을 위한 것. 정확하게 무슨 의미인지 파악하기보다는 hot-reloading을 위한 것이다 정도만 알아두자.
            },
            production: {
              plugins: ['@emotion'],
            },
          },
        },
        exclude: path.join(__dirname, 'node_modules'),
      },
      {
        test: /\.css?$/, // babel이 css도 js로 바꿔준다.
        use: ['style-loader', 'css-loader'], // 이 2개의 loader가 해준다.
      },
    ],
  },
  plugins: [
    // new ForkTsCheckerWebpackPlugin({ // ts 할 것이면 설정
    //   async: false,
    //   // eslint: {
    //   //   files: "./src/**/*",
    //   // },
    // }),
    new webpack.EnvironmentPlugin({ NODE_ENV: isDevelopment ? 'development' : 'production' }), // 리액트에서 NODE_ENV를 사용할 수 있게 해준다. 원래는 백엔드(정확히는 Node Environment)에서만 쓸 수 있는데 이것이 프론트에서도 가능하게 해준다.
  ],
  output: {
    // 결과물  설정
    path: path.join(__dirname, 'dist'), // dist 폴더 생성
    filename: '[name].js', // name은 entry의 파일 명이 된다. 여기서는 app으로 위에서 설정해놨으니 app.js가 되겠다.
    publicPath: '/dist/', // publicPath는 hot-reloading을 위해서 설정해줌
  },
  devServer: {
    // devServer 사용이유 3가지 => 1. hot-reloading 2. proxy server 3. historyFallback
    historyApiFallback: true, // react router에서 필요한 설정.
    port: 3090, // 프론트엔드 서버 포트 설정
    publicPath: '/dist/', // 이것을 해줘야함. index.html에서는 ./dist/app.js가 아닌 /dist/app.js로 해주자. webpack-dev-server에서 쓸 때는 /dist/로 해주자.
    proxy: {
      '/api/': {
        // 프론트엔드에서 /api/ 로 보내는 요청은
        target: 'http://localhost:3095', // 주소를 3095가 보낸 것처럼(3095는 서버의 도메인)
        changeOrigin: true, // 바꿔서 보내겠다.
        // webpack-dev-server가 3095인 마냥 속였기 때문에 OPTIONS 요청이 안보내진다. CORS-Error에 도움을 준다. 백엔드, 프론트엔드가 localhost일때 사용 가능. 나는 예전에 실제 서비스에서 http-proxy-middleware library 사용해서 해결했음
      },
    },
  },
};

// 개발환경때 쓸 plugin
if (isDevelopment && config.plugins) {
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.plugins.push(new ReactRefreshWebpackPlugin()); // 이 것이 있어야 hot-reloading 가능
  //   config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'server', openAnalyzer: true }));
}

// 배포환경때 쓸 plugin
if (!isDevelopment && config.plugins) {
  //   config.plugins.push(new webpack.LoaderOptionsPlugin({ minimize: true }));
  //   config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'static' }));
}

export default config;
