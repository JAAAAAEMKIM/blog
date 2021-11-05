​
## Toolbar 및 마무리
​
### toolbar
​
마지막으로 현재 todo들의 상태를 나타내는 부분이 있었으면 좋겠다.  
간단한 템플릿과 `totalCount`, `todoCount`, `doneCount`를 prop으로 받아서 보여주는 간단한 상태바 컴포넌트를 만들었다.
​
```
<template>
  <div class="todo-toolbar">
    <span>total: {{totalCount}}</span>
    <span>할 일: {{todoCount}}</span>
    <span>한 일: {{doneCount}}</span>
  </div>
</template>
​
<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator';
​
@Component()
export default class TodoToolbar extends Vue {
  @Prop() totalCount!: number;
  @Prop() todoCount!: number;
  @Prop() doneCount!: number;
}
​
</script>
​
<style>
.todo-toolbar {
  display: flex;
  justify-content: space-between;
}
</style>
```
​
먼저 만든 툴바를 todoList에 넣어준다.
​
```
<template>
  <div>
    <h1>TODO LIST</h1>
    <todo-toolbar 
      :totalCount="0"
      :todoCount="0"
      :doneCount="0"/>
      ...
  </div>
</template>
```
​
그럼 툴바와 함께 모두 0의 값이 입력되고 변경되지 않는 것을 볼 수 있다.
​
이제 TodoManager에서 `totalCount`, `todoCount`, `doneCount를` 만들어주자.
​
```
// TodoManager.ts
  get totalCount() {
    return this.todos.length;
  }
​
  get todoCount() {
    return this.todos.filter(todo => !todo.isDone).length;
  }
​
  get doneCount() {
    return this.totalCount - this.todoCount;
  }
```
​
이 값들을 todoToolbar에 전달해주기 위해 todoList에서 이어준다.
​
```
<template>
  <todo-toolbar 
    :totalCount="totalCount"
    :todoCount="todoCount"
    :doneCount="doneCount"/>
  ...
</template>
​
<script lang="ts">
export default class TodoList extends Vue {
  todoManager = TodoManager;
​
  get totalCount() {
    return TodoManager.totalCount;
  }
​
  get todoCount() {
    return TodoManager.todoCount;
  }
​
  get doneCount() {
    return TodoManager.doneCount;
  }
  ...
}
</script>
```
​
![결과](https://user-images.githubusercontent.com/43107046/140327908-f3712154-c762-4add-af93-25f540ca797e.gif)
​
위와 같이 완료된 것을 볼 수 있다!
​
## 끝
​
첫 글쓰기가 완료됐다. 잘 쓰려면 어떻게 하는게 좋을지 고민하면서 시행착오를 겪게 되는 것 같다. 다음글도 천천히 더 써봐야겠다.