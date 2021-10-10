<template>
  <div>
    <h1>TODO LIST</h1>
    <todo-toolbar 
      :totalCount="totalCount"
      :todoCount="todoCount"
      :doneCount="doneCount"/>
    <todo-input @enter="onInputTodo"/>
    <todo-item 
      v-for="todo in todoManager.todos"
      :key="`${todo.id}`"
      :todo="todo"
      @move="onMoveTodo"/>
  </div>
</template>

<script lang="ts">

'use strict';
import {Component, Vue} from 'vue-property-decorator';
import TodoItem from '@/todoItem';
import TodoInput from '@/todoInput';
import TodoToolbar from '@/todoToolbar';
import TodoManager from '@/TodoManager.ts';
import {Todo} from '@/Todo.ts';

@Component({
  components: {
    TodoItem,
    TodoInput,
    TodoToolbar
  }
})
export default class TodoList extends Vue {
  todoManager = TodoManager;

  get totalCount() {
    return TodoManager.totalCount;
  }

  get todoCount() {
    return TodoManager.todoCount;
  }
  
  get doneCount() {
    return TodoManager.doneCount;
  }

  onInputTodo(value: string) {
    TodoManager.create(value);
  }

  onMoveTodo(source: Todo, target: Todo) {
    TodoManager.move(source, target);
  }
}
</script>
<style scoped>
</style>