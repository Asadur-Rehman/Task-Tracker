/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import {
  readData,
  readStatusData,
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
      const taskId = Date.now().toString();
      const newTask = new Task(taskId, name, desc, 'Todo', start, end);
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

  async getBlueTasks() {
    const data = await readStatusData('tasks', 'Todo');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return data || [];
  }

  async getOrangeTasks() {
    const data = await readStatusData('tasks', 'InProgress');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return data || [];
  }

  async getGreenTasks() {
    const data = await readStatusData('tasks', 'Completed');
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
    name?: string,
    desc?: string,
    status?: string,
    start?: Date,
    end?: Date,
  ) {
    const updatePayload = Object.fromEntries(
      Object.entries({
        name,
        description: desc,
        status,
        startDate: start,
        deadline: end,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      }).filter(([_, v]) => v !== undefined),
    );

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    updateData('tasks', taskId, updatePayload);
  }

  deleteTask(taskId: string) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    deleteData('tasks', taskId);
  }
}
