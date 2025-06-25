export class Task {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public startDate: Date,
    public deadline: Date,
  ) {}
}
