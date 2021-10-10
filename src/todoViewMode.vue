
<template>
  <span class="view-wrapper">
    <span>{{todo.message}}</span>
    <span class="btn-area">
      <button class="edit-button" @click.stop="onClickEdit">편집</button>
      <button class="remove-button" @click.stop="onClickRemove">X</button>
    </span>
  </span>
</template>

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