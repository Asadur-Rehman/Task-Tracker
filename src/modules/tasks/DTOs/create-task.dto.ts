import { IsString, IsDateString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsDateString()
  startDate!: Date;

  @IsDateString()
  deadline!: Date;
}
