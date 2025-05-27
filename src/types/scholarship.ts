export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Scholarship {
  id: string;
  title: string;
  deadline: string;
  subtasks: Subtask[];
  completed?: boolean;
}
