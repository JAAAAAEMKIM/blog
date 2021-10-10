<template>
  <li class="todo-item" @click="onClickItem">
    <input type="checkbox" v-model="todo.isDone"/>
    <todo-edit-mode v-if="todo.isEditMode" :todo="todo"/>
    <todo-view-mode v-else :todo="todo"/>
  </li>
</template>

<script lang="ts">
import {Component, Prop, Ref, Emit, Vue} from 'vue-property-decorator';
import TodoManager from '@/TodoManager.ts';
import TodoEditMode from '@/todoEditMode.vue';
import TodoViewMode from '@/todoViewMode.vue';

@Component({
  components: {
    TodoEditMode,
    TodoViewMode
  }
})
export default class TodoItem extends Vue {
  @Prop() todo!: Todo;

  onClickItem() {
    TodoManager.toggleDone(this.todo);
  }
}
</script>
<style scoped>
.todo-item {
  display: flex;
  list-style: none;
  padding: 5px 10px;
  border: 1px solid #dddddd;
}
</style>