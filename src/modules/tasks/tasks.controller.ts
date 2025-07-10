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
import { UserDecorator } from '../../auth/user.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@UseGuards(FirebaseAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  addTask(
    @UserDecorator('uid') userId: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    const { name, description, startDate, deadline } = createTaskDto;
    return this.tasksService.insertTask(
      name,
      description,
      new Date(startDate),
      new Date(deadline),
      userId,
    );
  }

  @Get()
  getAllTasks(@UserDecorator('uid') userId: string) {
    return this.tasksService.getTasks(userId);
  }

  @Get('todo')
  getTodoTasks(@UserDecorator('uid') userId: string) {
    return this.tasksService.getTasksByStatus(userId, "Todo");
  }

  @Get('inprogress')
  getInprogressTasks(@UserDecorator('uid') userId: string) {
    return this.tasksService.getTasksByStatus(userId, "InProgress");
  }

  @Get('completed')
  getCompletedTasks(@UserDecorator('uid') userId: string) {
    return this.tasksService.getTasksByStatus(userId, "Completed");
  }

  @Get(':id')
  getTask(@Param('id') id: string, @UserDecorator('uid') userId: string) {
    return this.tasksService.getSingleTask(id, userId);
  }

  @Patch(':id')
  updateTask(
    @Param('id') id: string,
    @UserDecorator('uid') userId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const { name, description, status, startDate, deadline } = updateTaskDto;
    return this.tasksService.updateTask(
      id,
      userId,
      name,
      description,
      status,
      startDate ? new Date(startDate) : undefined,
      deadline ? new Date(deadline) : undefined,
    );
  }
}