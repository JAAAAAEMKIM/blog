# Vue 입문 - todolist 만들어보기 - TodoList Component

## TodoList Component

포스트를 작성하던 중, 리액트 개발 업무가 많아져서 뷰 쪽을 잘 못보는 바람에 3번째 포스트를 작성하는데 오래 걸렸다. 

### Vue Class Component

뷰는 기존의 옵션 객체를 넘겨줘서 컴포넌트를 만들기도 하지만, 클래스 기반 프로그래밍에 익숙하다면 클래스로 해볼 수 있다.

나는 클래스 기반 컴포넌트를 사용하게 됐기 때문에 이 사용법을 위주로 적어볼 예정이다.

안써본 사람들은 한번 이런게 있구나 보면 좋을 것 같다.


클래스 기반 컴포넌트를 사용할 때 `vue-property-decorator`와 타입스크립트를 사용하는데, 우선 몇가지 관련 설정이 필요하다. 


### todoList.vue

- 골뱅이 파싱 에러 -> ts-loader 재적용
- expected 1 argument but got 0 - @Component 괄호 안에 {}
- TodoItem이나 corresponding type을 찾을 수 없다 - resolve extensions 에 vue가 없었음.
- 스타일 unexpected token - css 로더 적용
- TS2307: Cannot find module '@/todoItem' or its corresponding type declarations.
  - shim 추가하면 일시적으로 해결되나 save 시 다시 나타나는 문제 발견 -> cache 관련 설정 추가
  <!-- - 
  - ```js
            options: {
              loaders: {
                js: 'babel-loader',
                options: {
                  cacheDirectory: true
                }
              }
    ``` -->
- ts 관련 설정또한 추가 
```js
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/], 
          transpileOnly: true 
        }
      },```
```

### todoList.vue

위와 같은 투두 리스트를 만들어 볼 계획이다.

먼저, `index.js`에서 루트 `div`에 붙을 컴포넌트를 만들어준다. `TodoList.vue`

투두리스트의 구성요소를 살펴보면 다음과 같다.

- 제목 부분
- 할 일 개수들을 표시해주는 툴바 영역
- 할 일 입력 인풋
- 할 일들

위 구성요소들을 기준으로 하나씩 컴포넌트를 만들었다.

우선, 제목은 단순히 텍스트로 사용할 것이므로 따로 컴포넌트화 하지 않았다.

툴바 컴포넌트: `todoToolbar.vue`

인풋 컴포넌트: `todoInput.vue`

할 일 컴포넌트: `todoItem.vue`

이를 통해 `todoList.vue`의 template 부분을 다음과 같이 구성했다. (아직 작동하지 않음.)

```html
<template>
  <div>
    <h1>TODO LIST</h1>
    <todo-toolbar />
    <todo-input />
    <todo-item v-for="todo in todoManager.todos"/>
  </div>
</template>
```

여기에 나는 Todo 데이터를 관리하는 부분과 view를 보여주는 컴포넌트를 분리하고 싶어서 TodoManager라는 클래스를 따로 만들었다. 그래서 폴더의 구성은 다음과 같이 작성되었다.

위 템플릿을 바탕으로 하나씩 `todoList.vue`에 들어갈 컴포넌트를 하나씩 채워넣는다.

각 파일마다 기본 export 하는 빈 클래스를 만들어만 놓으면, 하나씩 채워가면서 완성에 가까워지는 것을 볼 수 있다. 

```vue
<template>
...
</template>

<script lang="ts">

'use strict';
import {Component, Vue} from 'vue-property-decorator';
import TodoItem from '@/todoItem';
import TodoInput from '@/todoInput';
import TodoToolbar from '@/todoToolbar';
import TodoManager from '@/TodoManager.ts';

@Component({
  components: {
    TodoItem,
    TodoInput,
    TodoToolbar
  }
})
export default class TodoList extends Vue {
  ...
}
</script>
```

뷰 클래스 컴포넌트를 이용하여 컴포넌트를 작성할 때는 위와 같이 `@Component` decorator를 사용한다. decorator 안에는 component 옵션 객체가 들어가기 때문에 기존 방식의 옵션을 다 사용할 수 있지만, Prop, data, computed는 각각 다른 방식으로 작성하기 때문에 거의 다른 컴포넌트를 임포트하기위해 필요한 components 옵션만 들어가게 된다.

### todoInput.vue

```vue
<template>
  <input class="todo-input"/>
</template>

<script lang="ts">
import {Component, Prop, Emit, Vue} from 'vue-property-decorator';

@Component({})
export default class TodoInput extends Vue {

}
</script>
<style scoped>
.todo-input {
  padding: 5px 10px;
  border: 1px solid #dddddd;
  height: 24px;
  width: 100%;
}
</style>
```

todoInput의 기본 틀은 위와 같다.

input의 기능을 정리해보면,
1. 입력이 정상적으로 되어야한다.
2. 엔터를 누를 시 새로운 할 일 항목이 리스트에 추가되어야한다.
이다.

그렇다면 input에 입력되는 value를 todoInput에서 data로 관리할 수 있어야하고, 엔터 이벤트 핸들러를 정의해줘야한다.

#### data의 counterpart

뷰 클래스 컴포넌트에서 data를 관리하려면 클래스의 프로퍼티로 선언해주면 된다.
```js
예시)
@Component
class someComponent extends Vue {
  data: typeName;
  data2 = someValue;
}
```

TodoInput에서는 value를 관리할 데이터가 필요하고, 그 데이터는 `input` 엘리먼트의 value와 바인딩되어야하므로, v-model을 사용해줬다.

```vue
<template>
  <input class="todo-input" v-model="value"/>
</template>

<script lang="ts">
import {Component, Prop, Emit, Vue} from 'vue-property-decorator';

@Component({})
export default class TodoInput extends Vue {
  value = '';
}
</script>
```

#### Enter 이벤트 발생

이제 input의 value가 TodoInput 컴포넌트의 value와 바인딩되었다. 그러면, enter를 누르면 그 값이 저장되고 input내의 value가 초기화 되도록 변경해보자.

```vue
<template>
  <input class="todo-input" @keyup.enter="onEnter" v-model="value"/>
</template>

<script lang="ts">
import {Component, Prop, Emit, Vue} from 'vue-property-decorator';

@Component({})
export default class TodoInput extends Vue {
  value = '';

  get isValid(): boolean {
    return !!this.value;
  }

  @Emit('enter')
  emitEnter(val: string): string {
    return val;
  }

  onEnter(e: Event): void {
    if (this.isValid) {
      this.emitEnter(this.value);
      this.value = '';
    }
  }
}
</script>
```

`@keyup.enter`는 `v-on:keyup.enter`와 같은 표현으로, `keyup` 이벤트가 발생했고 그 이벤트의 키 코드가 엔터일 때 실행된다는 의미이다.
`onEnter`에서 문자열이 valid한지 여부를 확인하여, 유효한 문자열이라면 상위 컴포넌트로 `enter`이벤트를 발생시키도록 했다.

이렇게 발생시켜주면, 상위 컴포넌트에서 어떻게 활용할 지 결정할 수 있기 때문에 데이터를 처리하는 부분을 상위에 모아둘 수 있다.

여기서 `@Emit` 데코레이터를 볼 수 있다. 원래 이벤트를 발생시킬 때 Vue에서는 this.$emit을 사용한다. 하지만, 예시처럼 데코레이터를 사용해서 발생시킬 이벤트와 지정할 값을 전달해줄 수도 있다.

둘 다 써봤지만 큰 특장점이 있는 것은 아닌 것 같다. 다만 `this.$emit`이 좀 더 명령형 코드라면, `@Emit`이 좀 더 선언적인 코드로 보여서 객체지향이라는 관점에서는 더 적합한 것 같다.

테스트를 해보기 위해 TodoList.vue에서

```vue
<template>
  ...
  <todo-input @enter="onInputTodo"/>
  ...
</template>

<script>
  ...
  onInputTodo(value: string) {
    console.log(value);
  }
  ...
```
를 추가해준다음, 페이지에서 테스트 해보면 엔터를 누를 때마다 적절히 이벤트가 잘 발생하는 것을 알 수 있다.


## 다음 포스팅
글을 써야겠다고 정해둔 범위가 없는데 일도 바쁘다 보니 꾸준하게 쓰지 못했다. 
써보면서 공부는 간간이 했는데, 문서화 해야지하면서도 잘 손이 안가게 되더라.
그래서 다음 포스팅 범위를 미리 정해놓고 써봐야겠어서 한번 정해봤다.

다음포스팅에서는 자연스럽게 이어지도록 투두 매니져를 만들어보자. singleton으로 작성해볼 예정이다.

## 그 다음 포스팅
투두 아이템과 투두 에딧, 그리고 투두 툴바로 일단 해볼 예정이다.