# Vue 입문 - todolist 만들어보기

## npm으로 시작하기

### npm

https://docs.npmjs.com/about-npm

node package manager로 노드 프로젝트를 시작할 때 필요한 패키지를 관리하고, 실행할 수 있도록 해준다. 

이전까지는 html의 `script` 태그를 이용하여 cdn을 통해 Vue를 가져왔다. 이번에는 실제로 더 많이 사용하게될 (아마도) 방법인 npm을 통해 Vue를 설치해보고 todolist를 만들어보기로 했다.

### Vue 설치

npm init -y

```bash
npm install vue
```

vue를 설치해서 사용하는데, vue를 이전과 같이 js, css 따로 만들어서 사용해도되지만, sfc(single file component)라는 좋은 방법이 존재한다. 

이 전까지는 html / css / js 크게 세가지로 파일을 구분해서 나눴지만, 그렇게 하는것보다 비슷한 기능들끼리 묶어서 파일을 분류해놓으면 응집력이 높아지고 유지보수에 더 효율적이게 된다. 


Vue에서는 .vue 파일을 사용하여 위 세가지를 한 파일에 묶어서 사용하는 형식이 보편적이다. Vue 프로젝트를 한 번이라도 본 적 있다면 템플릿 부분 / script 부분 / style 부분으로 구성된 파일을 본 적 있을 것이다. 그게 sfc다.


### Webpack 설치

sfc를 사용하려면 webpack을 사용해야한다. 웹팩을 설치해주자. 개발환경에서 사용하므로 --save-dev 옵션을 붙여준다.

```sh
npm install --save-dev webpack
```

이제 웹팩 설정부터 해보자. 웹팩은 webpack.config.js 파일을 만들어 설정할 수 있다.

웹팩에서 .vue파일을 로드할 수 있게 해주는 로더인 `vue-loader`를 설치해준다.

https://vue-loader.vuejs.org/

```sh
npm install -D vue-loader vue-template-compiler
```

vue-loader와 함께 설치해준 vue-template-compiler는 vue template을 컴파일해주는 역할을 한다. 이 때 컴파일러의 버전이 vue와 호환되는 버전이어야 제대로 컴파일 할 수 있다.

이제 웹팩 설정파일을 만들고 설정을 해보자.

```js

const path = require('path');
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  entry: './index.js',
  module: {
    rules: [{ test: /\.vue$/, use: 'vue-loader' }],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  plugins: [
    // make sure to include the plugin!
    // js에 적용돼야하는 설정들을 vue의 <script>태그 내에서도 적용되게 해줌.
    new VueLoaderPlugin()
  ]
}
```

> cf) loader는 웹팩 번들이 빌드되기 전에 전처리를 담당. plugin은 웹팩이 빌드하는 과정 내에 hook처럼 관여한다.

설정을 했으니 webpack으로 원하는 output이 만들어지는지 실행시켜본다. cli로 웹팩을 실행하려면 webpack-cli가 필요하다. 설치해준다.

그 다음은 entry가 필요하다. 현재 entry는 index.js로 설정되어있으므로 빈 파일을 하나 만들어준다.

이제 webpack build --mode=development로 빌드를 실행할 수 있다. 매번 커맨드를 다 치기 힘드니, package.json의 scripts에
```json
{
  "build": "webpack build --mode=development"
}
```
를 추가해준 후 
```sh
npm run build
```
를 실행시켜보자.

output으로 지정해줬던 `/dist` 경로에 output filename으로 지정해준 `bundle.js`가 생성된 것을 볼 수 있다.

### webpack-dev-server

이전에는 html파일을 직접 실행시키는 방법으로 개발을 진행해보았다. 하지만 더 좋은 방법이 있다. 파일을 수정하면 자동으로 변경사항을 반영해주는 툴이다. webpack-dev-server를 설치해주자.

```sh
npm i -D webpack-dev-server
```

그 다음, package.json에 scripts를 추가해준다. 

```json
{
  ...
  "dev": "webpack serve --mode=development"
}
```

그리고 화면에 표시할 뷰를 만들어주자. index.html을 생성한 후 기본적인 설정만 해준다.

```html
<!-- index.html -->
<html lang="ko">
  <head >
    <title>제목</title>
    <meta charset="UTF-8">
  </head>
  <body>
    하이
  </body>
</html>
```

그 후 npm run dev를 실행하면 원하는 화면이 뜬다! 
(빈 화면에 "하이"라는 글자가 뜨면 성공)

이제 준비는 완료했고 본격적으로 sfc를 만들어볼 수 있다.

### index.js 설정

지금 index.js는 빈 파일이다. 웹팩은 이 파일부터 시작해서 연결된 모든 파일을 탐색한다. 나는 여기서 루트 앱을 만들어서 마운트 시킬 생각이다.

우선, index.html에 앱이 마운트될 위치를 만들어준다. `<body>`의 하이를 다음과 같이 바꿔주자.

```html
  <body>
    <div id="root"></div>
  </body>
```

저기 `id="root"` 부분에 내 앱을 마운트 시킬 것이다. 그러려면 index.js에서 `#root`에 뷰 앱이 마운트 되도록 해주면 된다.

```js
// index.js

import Vue from 'vue';

const app = new Vue();

app.$mount('#root');
```

여기서 html이 index.js의 스크립트를 로드해야하는데, 우리는 지금 웹팩을 통해 index.js부터 파일들을 번들링하여 사용하고 있으므로 그 결과물을 가져와주면 된다.

```html
<script src="dist/bundle.js"></script>
```

지금은 빈 앱이라서 아무 내용도 보이지 않겠지만, 이제 Todolist를 만들어서 앱에 넣어주기만 작동하는 모습을 볼 수 있다. 
