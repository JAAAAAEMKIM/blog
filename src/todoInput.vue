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
<style scoped>
.todo-input {
  padding: 5px 10px;
  border: 1px solid #dddddd;
  height: 24px;
  width: 100%;
}
</style>