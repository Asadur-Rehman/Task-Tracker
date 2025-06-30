import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  addTask(
    @Body('name') taskName: string,
    @Body('description') taskDesc: string,
    @Body('startDate') taskStart: Date,
    @Body('deadline') taskEnd: Date,
  ) {
    const generatedId = this.tasksService.insertTask(
      taskName,
      taskDesc,
      taskStart,
      taskEnd,
    );
    return { id: generatedId };
  }

  @Get()
  getAllTasks() {
    return this.tasksService.getTasks();
  }

  @Get('blue')
  getBlueTasks() {
    return this.tasksService.getBlueTasks();
  }

  @Get('orange')
  getOrangeTasks() {
    return this.tasksService.getOrangeTasks();
  }

  @Get('green')
  getGreenTasks() {
    return this.tasksService.getGreenTasks();
  }

  @Get(':id')
  getTask(@Param('id') taskId: string) {
    return this.tasksService.getSingleTask(taskId);
  }

  @Patch(':id')
  updateTask(
    @Param('id') taskId: string,
    @Body('name') taskName: string,
    @Body('description') taskDesc: string,
    @Body('status') taskStatus: string,
    @Body('startDate') taskStart: Date,
    @Body('deadline') taskEnd: Date,
  ) {
    this.tasksService.updateTask(
      taskId,
      taskName,
      taskDesc,
      taskStatus,
      taskStart,
      taskEnd,
    );
    return null;
  }

  @Delete(':id')
  removeTask(@Param('id') taskId: string) {
    this.tasksService.deleteTask(taskId);
    return null;
  }
}
