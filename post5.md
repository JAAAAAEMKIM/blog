## todo 삭제 및 편집

### todoItem 템플릿

```
<!-- todoItem.vue -->
<template>
  <li class="todo-item" @click="onClickItem">
    <input type="checkbox" v-model="todo.isDone"/>
      <span>{{todo.message}}</span>
    <span class="btn-area">
      <button class="edit-button" @click.stop="onClickEdit">편집</button>
      <button class="remove-button" @click.stop="onClickRemove">X</button>
    </span>
  </li>
</template>
```

템플릿은 간단하다. 체크박스가 있고, 메시지가 보인다. 뒤에는 편집과 삭제 버튼이 있다. 이 버튼들을 누를 때 기능들을 추가해볼 것이다.

<br>

### @click.stop

편집/삭제 버튼을 만들면서 `v-on:click.stop`을 사용했다. `.stop`을 붙이면 이벤트의 propagation이 중지된다.

즉, 편집버튼을 클릭한다고 해보자.  
따로 캡쳐링 단계에서 이벤트를 리스닝하는 리스너는 없으므로, 버블링 단계에서 가장 먼저 이벤트 핸들러 `onClickEdit`이 호출된다.  
`.stop`이 없다면 그 후 버블링이 진행되어 상위 컴포넌트인 `li`에서 `onClickItem`이 호출된다.

하지만 `.stop`을 통해 이벤트 propagation을 중지 시켜서 원하는 이벤트만 발생하도록 만들어주는 것이다.

<br>

### onClickEdit

`onClickEdit`에 이제 편집 시의 동작을 정의해주자. 편집 시에는 `todo-item`이 편집모드가 되며 이후 \[완료 버튼을 눌러 편집 완료\] / \[취소 버튼을 눌러 편집 취소\]로 작동하게 할 것이다.

처음엔 `TodoItem` 컴포넌트에서 `isEditMode`라는 State로 설정하여 사용하려했다. 하지만, 에러의 위험이 적게 만들기 위해 stateless한 컴포넌트를 사용하기로 마음을 바꿨고, `TodoManager`에서 `TodoItem`의 상태를 관리할 수 있도록 - Data를 관리하는 쪽에서만 상태가 변화되도록 state들을 모아둠. 컴포넌트는 받은 data에 따라 일관되게 렌더링 하도록. - `DefaultTodo` 클래스를 `EditableTodo` 클래스로 변경하여 `isEditMode` 프로퍼티를 추가해주었다.

```
// Todo.ts
export interface Todo {
  message: string;
  id: number;
  isDone: boolean;

  setMessage: (value: string) => void;
  toggleDone: () => void; 
}

export class EditableTodo implements Todo{
  message: string;
  id: number;
  isDone: boolean = false;;
  isEditMode: boolean = false;

  constructor(message: string) {
    this.message = message;
    this.id = Number(new Date());
  }

  setMessage(value: string) {
    this.message = value;
  }

  toggleDone() {
    this.isDone = !this.isDone;
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }
}
```

`isEditMode`는 현재 편집모드인지 확인하는 state이고 `toggleEditMode`를 통해 상태 변경이 가능하다.

이제 `TodoItem`에서 `todo.isEditMode`에 따라서 일반모드를 노출할 것인지, 편집 모드를 노출할 것인지 결정한다.

여기서 `todo.toggleEditMode`를 직접 호출하거나, `@Emit`을 통해 상위 컴포넌트로 전달할 수도 있지만 `TodoManager`를 사용하기로 했다.

`toggleEditMode`를 직접 호출한다면, 나중에 편집 시 `todoManager`단에서 처리해줄 로직이 생길 때 코드의 변경이 더 많이 필요할 것이다.

> e.g. 편집모드가 열려있는데 다른 todo를 편집하려고 할 때, 편집 중인 todo가 있는지 확인하여 alert를 띄워주는 로직

`Emit`을 통해 상위 컴포넌트로 전달한다면 나중에 코드스플리팅을 하여 EditMode와 ViewMode를 분리하고자 할 때, 또 `Emit`을 통해 한번 더 상위 컴포넌트와 이어주는 작업이 필요하다.

전역 데이터 관리자인 `TodoManager`를 하위 컴포넌트에서 참조하여 상태를 변경해준다면, 스펙의 변경이 생겨도 `TodoManager` 내에서의 로직만 변경해주고, 컴포넌트들은 상태에 따라 렌더링만 잘 해주면 되기 때문에 확장에 더 유리할 것으로 생각했다.

```
// 원래 하려던 방식 1
onClickEdit() {
  this.todo.toggleEditMode();
}

// 원래 하려던 방식 2
@Emit
onClickEdit() {
  return this.todo;  // 상위 컴포넌트에서 핸들링.
}

// 변경한 방식
onClickEdit() {
  TodoManager.toggleEditMode(todo);
}

// TodoManager.ts
...
toggleEditMode(todo: Todo) {
  todo.toggleEditMode();  // 스펙의 변경이 생기면 여기나 Todo의 toggleEditMode만 변경하면 된다.
}
```

`setMessage`의 경우도 그렇게 하는게 나을 것 같아서 변경해주었다. (중복 체크 로직 등이 생긴다고 하면 `todoManager`단에서 처리해야하므로.)

data와 view를 구분하려고 하면 할수록 data 단의 인터페이스인 `TodoManager`가 일종의 Service 레이어가 되는 느낌이 든다. 나쁘진 않은 것 같다.

<br>

### Edit Mode / View Mode

이제 todo.isEditMode를 통해 분기처리를 해준다.

일반 모드와 편집 모드에서의 컴포넌트를 분리해준다. 컴포넌트 분리를 하지 않을 수도 있지만, 가독성 측면에서 추상화 레벨을 맞추기 위해 컴포넌트를 분리해주는 것이 더 깔끔한 코드로 보였다.

```
<!-- todoItem.vue template -->
<template>
  <li class="todo-item" @click="onClickItem">
    <input type="checkbox" v-model="todo.isDone"/>
    <todo-edit-mode v-if="todo.isEditMode" :todo="todo"/>
    <todo-view-mode v-else :todo="todo"/>
  </li>
</template>
```

와 같이 분리하고, `todoViewMode.vue`, `todoEditMode.vue`를 세로 만들어줬다.

`todoViewMode.vue`

```
<template>
  <span class="view-wrapper">
    <span>{{todo.message}}</span>
    <span class="btn-area">
      <button class="edit-button" @click.stop="onClickEdit">편집</button>
      <button class="remove-button" @click.stop="onClickRemove">X</button>
    </span>
  </span>
</template>
```

```
<script lang="ts">
import { Component, Prop, Ref, Emit, Vue } from 'vue-property-decorator';
import TodoManager from '@/TodoManager.ts';

@Component()
export default class TodoViewMode extends Vue {
  @Prop() todo!: Todo;

  onClickEdit() {
    TodoManager.toggleEditMode(this.todo);
  }

  onClickRemove() {
    TodoManager.removeTodo(this.todo);
  }
}
</script>
```

```
<style scoped>
.view-wrapper {
  display: flex;
  width: 100%;
}
.btn-area {
  margin: auto;
  margin-right: 0;
}
</style>
```

`todoEditMode.vue`

```
<template>
  <span class="edit-wrapper">
    <input
      class="edit-input"
      ref="editInput"
      :value="todo.message"
      @click.stop
      @keyup.enter="onEditDone"
    />
    <span class="btn-area">
      <button class="edit-button" @click.stop="onEditDone">완료</button>
      <button class="remove-button" @click.stop="onCancelEdit">취소</button>
    </span>
  </span>
</template>
```

```
<script lang="ts">
import { Component, Prop, Ref, Emit, Vue } from 'vue-property-decorator';
import TodoManager from '@/TodoManager.ts';

@Component()
export default class TodoEditMode extends Vue {
  @Prop() todo!: Todo;
  @Ref() readonly editInput!: HTMLInputElement;

  onCancelEdit() {
    TodoManager.toggleEditMode(this.todo);
  }

  onEditDone(e) {
    TodoManager.setMessage(this.todo, e.target.value);
    TodoManager.toggleEditMode(this.todo);
  }

  created() {
    this.$nextTick(() => this.editInput.focus());
  }
}
</script>
```

```
<style scoped>
.edit-wrapper {
  display: flex;
  flex-grow: 1;
}
.edit-input {
  border-radius: 0;
  border: 1px solid #dddddd;
  padding: 0 5px;
  flex-grow: 1;
}
.btn-area {
  margin: auto;
  margin-right: 0;
}
</style>
```

편집모드에서는 '완료'와 '취소' 버튼이 있어서 완료 클릭 시 저장, 취소 클릭 시 기본모드로 돌아가도록 했다.

기본모드에서는 '편집'과 'X' 버튼이 있어서 편집 클릭 시 편집모드로 변경, X 클릭 시 todo가 삭제되도록 했다.

<br>

### 삭제

삭제는 편집보다 간단하다. 클릭 시 `TodoManager`의 `removeTodo`를 호출해준다. `removeTodo`는 아래와 같이 구현했다.

id를 기준으로 todo 목록에서 찾아 제거해주는 작업을 한다.

```
// TodoManager.ts
  hasSameId(id: number) {
    return (todo: Todo) => todo.id === id;
  }

  findIndexById(id: number): number {
    return this.todos.findIndex(this.hasSameId(id));
  }

  removeTodo(todo: Todo) {
    this.todos.splice(this.findIndexById(todo.id), 1);
  }
```

![완성 이미지](https://user-images.githubusercontent.com/43107046/136689591-ac916c94-b54c-4285-abbc-9159191eb0d9.gif)

<br>

### 5번째 포스팅 마무리

-   어렵지 않게 수정과 삭제까지 해볼 수 있었다.

다음 포스팅으로 해볼 것은 status bar 작성이다. 간단해서 짧게 끝날 것 같다.

이후에는 이걸로 좀 더 발전 시킬 지, 다른 생각해둔걸 시작할 지 고민중이다.

  
  

-   코드를 계속 짤수록 코드를 짜는 시간보다 구조를 고민하는 시간이 많아지는 것 같다.

지금은 좀 오래걸리지만 이런 과정을 통해 더 성장하면 좋겠다.

github에 원래는 업로드 안하려고 했는데, 포스팅 별 변화를 기록하면 좋을 것 같다는 생각에 늦은 감이 있지만 올려봤다.

[https://github.com/JAAAAAEMKIM/blog-todolist-vue](https://github.com/JAAAAAEMKIM/blog-todolist-vue)

다음 사이드 프로젝트 부터는 초기 계획세울 때부터 깃헙 업로드를 고려하면서 해야겠다.