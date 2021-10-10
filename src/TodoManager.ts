import {Todo, EditableTodo} from '@/Todo.ts'

class TodoManager {
  todos: Array<Todo> = [];

  hasSameId(id: number) {
    return (todo: Todo) => todo.id === id;
  }

  findIndexById(id: number): number {
    return this.todos.findIndex(this.hasSameId(id));
  }

  get totalCount() {
    return this.todos.length;
  }

  get todoCount() {
    return this.todos.filter(todo => !todo.isDone).length;
  }
  
  get doneCount() {
    return this.totalCount - this.todoCount;
  }

  toggleEditMode(todo: Todo) {
    todo.toggleEditMode();
  }

  toggleDone(todo: Todo) {
    todo.toggleDone();
  }

  removeTodo(todo: Todo) {
    this.todos.splice(this.findIndexById(todo.id), 1);
  }

  setMessage(todo: Todo, value: string) {
    todo.setMessage(value);
  }
  
  create(message: string) {
    this.todos.push(new EditableTodo(message));
  }

  move(source: number, target: number) {
    const [tmp] = this.todos.splice(this.findIndexById(source), 1);
    this.todos.splice(this.findIndexById(target), 0, tmp);
  }
}

export default new TodoManager();