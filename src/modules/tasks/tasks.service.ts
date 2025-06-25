/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import {
  readData,
  readAllData,
  createData,
  deleteData,
  updateData,
} from '../../firebase/crud';

import { Task } from './entities/task.model';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  async insertTask(
    name: string,
    desc: string,
    start: Date,
    end: Date,
  ): Promise<string | null> {
    try {
      const taskId = Date.now().toString(); // or use generateId() from crud.ts
      const newTask = new Task(taskId, name, desc, start, end);
      await createData('tasks', newTask);
      return taskId;
    } catch (err) {
      console.error('Failed to insert task:', err);
      return null;
    }
  }

  async getTasks() {
    const data = await readAllData('tasks');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return data || [];
  }

  async getSingleTask(taskId: string) {
    const task = await readData('tasks', taskId);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return task;
  }

  updateTask(
    taskId: string,
    name: string,
    desc: string,
    start: Date,
    end: Date,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    updateData('tasks', taskId, {
      name: name,
      description: desc,
      startDate: start,
      deadline: end,
    });
  }

  deleteTask(taskId: string) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    deleteData('tasks', taskId);
  }
}
