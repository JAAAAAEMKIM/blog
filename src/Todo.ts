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