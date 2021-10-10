<template>
  <div class="todo-toolbar">
    <span>total: {{totalCount}}</span>
    <span>할 일: {{todoCount}}</span>
    <span>한 일: {{doneCount}}</span>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator';

@Component()
export default class TodoToolbar extends Vue {
  @Prop() totalCount!: number;
  @Prop() todoCount!: number;
  @Prop() doneCount!: number;
}

</script>

<style>
.todo-toolbar {
  display: flex;
  justify-content: space-between;
}
</style>