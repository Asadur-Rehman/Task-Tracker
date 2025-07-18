import { Injectable } from '@nestjs/common';
import {
  readData,
  createData,
  updateData,
  deleteData,
  readDataByField,
  readPaginatedDataByFields,
  countMatchingDocs,
  readNumberOfStatusData,
  readNumberOfOverdueTasksForUser,
  readNumberOfUpcomingDeadlines,
} from '../../firebase/crud';
import { Task } from './entities/task.model';
import { Stats } from './entities/stat.model';

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
      const newTask = new Task('', name, desc, 'Todo', start, end, userId);
      const taskId = await createData('tasks', { ...newTask });
      return taskId;
    } catch (err) {
      console.error('Failed to insert task:', err);
      return null;
    }
  }

  

  async getTasks(userId: string): Promise<Task[]> {
    return await readDataByField<Task>('tasks', 'userId', userId);
  }

  async getNumberOfTasks(userId:string): Promise<Number> {
    return await countMatchingDocs('tasks', 'userId', userId);
  }

  async getStats(userId: string): Promise<Stats> {
    const totalTasks = await countMatchingDocs('tasks', 'userId', userId);
  
    const completedTasks = await readNumberOfStatusData('tasks', 'Completed', userId);
    const inProgressTasks = await readNumberOfStatusData('tasks', 'InProgress', userId);
    const toDoTasks = await readNumberOfStatusData('tasks', 'Todo', userId);
    const overDueTasks = await readNumberOfOverdueTasksForUser('tasks', userId);
    const upcomingDeadlines = await readNumberOfUpcomingDeadlines('tasks', userId);
  
    const completionRate = totalTasks === 0 ? 0 : Number(completedTasks) / Number(totalTasks);
  
    return new Stats(
      totalTasks,
      completedTasks,
      inProgressTasks,
      toDoTasks,
      overDueTasks,
      upcomingDeadlines,
      completionRate,
    );
  }
  

  async getPaginatedTasksByStatus(
    userId: string,
    status: string,
    limit: number,
    cursor?: string,
    orderBy?: string
  ): Promise<{ tasks: Task[]; nextCursor: string | null }> {
    const { data, lastVisibleId } = await readPaginatedDataByFields<Task>(
      'tasks',
      [
        { field: 'userId', value: userId },
        { field: 'status', value: status },
      ],
      limit,
      cursor,
      orderBy
    );
  
    return {
      tasks: data,
      nextCursor: lastVisibleId,
    };
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
