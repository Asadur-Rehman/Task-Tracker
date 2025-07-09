import { Injectable } from '@nestjs/common';
import {
  readData,
  createData,
  updateData,
  deleteData,
  readDataByField,
  readDataByFields,
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

  async getTasks(userId: string): Promise<Task[]> {
    return await readDataByField<Task>('tasks', 'userId', userId);
  }

  async getBlueTasks(userId: string): Promise<Task[]> {
    return await readDataByFields<Task>('tasks', [
      { field: 'userId', value: userId },
      { field: 'status', value: 'Todo' },
    ]);
  }

  async getOrangeTasks(userId: string): Promise<Task[]> {
    return await readDataByFields<Task>('tasks', [
      { field: 'userId', value: userId },
      { field: 'status', value: 'InProgress' },
    ]);
  }

  async getGreenTasks(userId: string): Promise<Task[]> {
    return await readDataByFields<Task>('tasks', [
      { field: 'userId', value: userId },
      { field: 'status', value: 'Completed' },
    ]);
  }

  async getSingleTask(taskId: string, userId: string): Promise<Task | null> {
    const task = await readData<Task>('tasks', taskId);
    if (!task || task.userId !== userId) {
      throw new Error('Unauthorized access to task');
    }
    return task;
  }

  async updateTask(
    taskId: string,
    userId: string,
    name?: string,
    desc?: string,
    status?: string,
    start?: Date,
    end?: Date,
  ): Promise<void> {
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

    await updateData('tasks', taskId, updatePayload);
  }

  async deleteTask(taskId: string, userId: string): Promise<void> {
    const task = await readData<Task>('tasks', taskId);
    if (task?.userId === userId) {
      await deleteData('tasks', taskId);
    } else {
      throw new Error('Unauthorized deletion');
    }
  }
}
