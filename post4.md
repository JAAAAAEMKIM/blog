
이전 글에서 todoInput을 만들어서 이벤트를 Emit 시키고 todoList에서 받아서 출력해보았다.

이번에는 그 이벤트를 받아서 새로운 투두를 만들어본다.

## TodoManager.ts

투두를 생성하기위해 투두 데이터들을 관리하는 매니저 클래스를 만들어 본다.

사실 이름을 매니저라고 하는 것이 적절한 것인지는 의문이다. 그리 좋은 이름은 아닌 것 같지만 직관적인 것 같아서 그렇게 해봤다.

Store와 비슷한 역할을 한다.

### Todo 클래스

우선 Todo 클래스를 만들었다. Todo의 데이터에는 투두에 담길 `message`, 각 투두의 `id`, 그리고 완료여부를 나타내는 `isDone`이 있다.

메서드로는 message를 변경할 수 있는 `setMessage`와 완료여부를 toggle할 수 있도록 하는 `toggleDone`을 만들었다.

```ts
// /src/Todo.ts 새로 만들어줌.

interface Todo {
  message: string;
  id: number;
  isDone: boolean;

  setMessage: (value: string) => void;
  toggleDone: () => void; 
}

class DefaultTodo implements Todo{
  message: string;
  id: number;
  isDone: boolean;
  
  constructor(message: string) {
    this.message = message;
    this.id = Number(new Date());  // uuid 등을 쓸 수 있지만, 간단히 Date로 구현해봄
    this.isDone = false;
  }

  setMessage(value: string) {
    this.message = value;
  }

  toggleDone() {
    this.isDone = !this.isDone;
  }
}
```

### TodoManager 클래스

이 투두들을 생성하고, 목록으로 관리할 수 있는 TodoManager 클래스도 만들어야 한다.

우선, todoInput의 enter 이벤트를 받아서 생성할 수 있도록 `create`부터 만들어 주었다.

```ts
class TodoManager {
  todos: Array<Todo> = [];
  
  create(message: string) {
    this.todos.push(new Todo(message));
  }
}

export default new TodoManager();
```

이 모듈을 todoList에서 import하여 사용할 수 있다. 

템플릿의 todo-input에서 실행된 enter 이벤트에서 onInputTodo로 전달된 값을 이용해 Todo가 만들어진다.

```html
<template>
  <div>
    <h1>TODO LIST</h1>
    <todo-toolbar />
    <todo-input @enter="onInputTodo"/>
    <todo-item v-for="todo in todoManager.todos" />
  </div>
</template>
```
```ts
@Component({
  components: {
    TodoItem,
    TodoInput,
    TodoToolbar
  }
})
export default class TodoList extends Vue {
  todoManager = TodoManager;

  onInputTodo(value: string) {
    TodoManager.create(value);
  }
}
```

todoManager의 todos에 새로운 아이템이 들어오면, `todo-item`의 v-for로 인해 `TodoManager.todos`의 모든 항목들이 todo-item으로 만들어진다.
아직 todo-item이 없어서 렌더링은 안되므로, `todo-item`을 만들어서 눈으로 확인해보자.

![이미지](http://naver.com)

이런 간단한 TodoItem을 만들 계획이다.

### todoItem

```html
<!-- todoItem.vue -->
<template>
  <li class="todo-item" @click="onClickItem">
    <input type="checkbox" v-model="todo.isDone"/>
      <span>{{todo.message}}</span>
    <span class="btn-area">
      <button class="edit-button">편집</button>
      <button class="remove-button">X</button>
    </span>
  </li>
</template>
```

```ts
import {Component, Prop, Ref, Emit, Vue} from 'vue-property-decorator';

@Component({})
export default class TodoItem extends Vue {
  @Prop() todo!: Todo;
  @Prop() isChecked!: boolean;
  
  onClickItem() {
    // TODO
  }

  onClickEdit() {
    // TODO
  }
  
  onClickRemove() {
    // TODO
  }
}
```

`onClickItem`에서는 투두를 클릭했을 때 어떤 액션을 할 지를 정의해준다.

클릭하면 체크가 변경되게할 생각이기 때문에 클릭시 `this.todo.toggleDone`을 호출해준다.

그럼 클릭 시에 `todo`에 isDone값이 변경되면서 v-model로 바인딩된 체크박스가 체크/체크해제 되는 것을 볼 수 있다.

```ts
onClickItem() {
  this.todo.toggleDone();
}
```

이 TodoItem을 TodoList에 적용하기 위해 `todo`를 TodoItem에 넘겨준다.
```html
<todo-item v-for="todo in todoManager.todos" todo="todo"/>
```

그러면 아직 편집과 삭제가 동작안하지만, Input을 입력하고 엔터하면 투두들이 화면에 표시되고 체크를 토글할 수 있는 것을 볼 수 있다.

## 다음 포스팅
todo-item과 todo-manager를 통해 삭제 및 편집 작업까지 완성해 본다.
그 다음에는 toolbar까지 완료해볼 생각이다.