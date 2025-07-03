// src/tasks/entities/task.model.ts
export class Task {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public status: string,
    public startDate: Date,
    public deadline: Date,
    public userId: string,
  ) {}
}
