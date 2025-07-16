export class Stats {
    constructor(
      public totalTasks: Number,
      public completedTasks: Number,
      public inProgressTasks: Number,
      public toDoTasks: Number,
      public overDueTasks: Number,
      public upcomingDeadlines: Number,
      public completionRate: Number,
    ) {}
  }
  