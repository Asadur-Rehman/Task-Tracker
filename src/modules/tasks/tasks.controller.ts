// src/tasks/tasks.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { FirebaseAuthGuard } from '../../auth/firebase-auth.guard';
import { User } from '../../auth/user.decorator';

@UseGuards(FirebaseAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  addTask(
    @User('uid') userId: string,
    @Body('name') name: string,
    @Body('description') desc: string,
    @Body('startDate') start: Date,
    @Body('deadline') end: Date,
  ) {
    return this.tasksService.insertTask(name, desc, start, end, userId);
  }

  @Get()
  getAllTasks(@User('uid') userId: string) {
    return this.tasksService.getTasks(userId);
  }

  @Get('blue')
  getBlueTasks(@User('uid') userId: string) {
    return this.tasksService.getBlueTasks(userId);
  }

  @Get('orange')
  getOrangeTasks(@User('uid') userId: string) {
    return this.tasksService.getOrangeTasks(userId);
  }

  @Get('green')
  getGreenTasks(@User('uid') userId: string) {
    return this.tasksService.getGreenTasks(userId);
  }

  @Get(':id')
  getTask(@Param('id') id: string, @User('uid') userId: string) {
    return this.tasksService.getSingleTask(id, userId);
  }

  @Patch(':id')
  updateTask(
    @Param('id') id: string,
    @User('uid') userId: string,
    @Body('name') name: string,
    @Body('description') desc: string,
    @Body('status') status: string,
    @Body('startDate') start: Date,
    @Body('deadline') end: Date,
  ) {
    return this.tasksService.updateTask(
      id,
      userId,
      name,
      desc,
      status,
      start,
      end,
    );
  }

  @Delete(':id')
  removeTask(@Param('id') id: string, @User('uid') userId: string) {
    return this.tasksService.deleteTask(id, userId);
  }
}
