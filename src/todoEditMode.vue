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
  
  onEditDone() {
    TodoManager.setMessage(this.todo, this.editInput.value);
    TodoManager.toggleEditMode(this.todo);
  }

  created() {
    this.$nextTick(() => this.editInput.focus());
  }
}
</script>
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
