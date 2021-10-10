import Vue from 'vue';
import TodoList from './todoList.vue';

new Vue({
  render: h => h(TodoList),
}).$mount('#root');