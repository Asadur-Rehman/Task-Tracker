export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
  preferences?: {
    theme: 'light' | 'dark';
    tasksPerPage: number;
    defaultSort: 'dueDate' | 'priority' | 'createDate';
  };
}
