/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/tasks/tasks.service.ts
import { Injectable } from '@nestjs/common';
import {
  readData,
  readAllData,
  readStatusData,
  createData,
  updateData,
  deleteData,
} from '../../firebase/crud';
import { Task } from './entities/task.model';

@Injectable()
export class TasksService {
  async insertTask(
    name: string,
    desc: string,
    start: Date,
    end: Date,
    userId: string,
  ): Promise<string | null> {
    try {
      const taskId = Date.now().toString();
      const newTask = new Task(taskId, name, desc, 'Todo', start, end, userId);
      await createData('tasks', newTask);
      return taskId;
    } catch (err) {
      console.error('Failed to insert task:', err);
      return null;
    }
  }

  async getTasks(userId: string) {
    const all = await readAllData('tasks');
    return all.filter((t) => t.userId === userId);
  }

  async getBlueTasks(userId: string) {
    const data = await readStatusData('tasks', 'Todo');
    return data.filter((t) => t.userId === userId);
  }

  async getOrangeTasks(userId: string) {
    const data = await readStatusData('tasks', 'InProgress');
    return data.filter((t) => t.userId === userId);
  }

  async getGreenTasks(userId: string) {
    const data = await readStatusData('tasks', 'Completed');
    return data.filter((t) => t.userId === userId);
  }

  async getSingleTask(taskId: string, userId: string) {
    const task = await readData('tasks', taskId);
    if (task?.userId !== userId) {
      throw new Error('Unauthorized access to task');
    }
    return task;
  }

  updateTask(
    taskId: string,
    userId: string,
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
        userId,
      }).filter(([_, v]) => v !== undefined),
    );

    updateData('tasks', taskId, updatePayload);
  }

  deleteTask(taskId: string, userId: string) {

    readData('tasks', taskId).then((task) => {
      if (task?.userId === userId) {
        deleteData('tasks', taskId);
      } else {
        throw new Error('Unauthorized deletion');
      }
    });
  }
}
