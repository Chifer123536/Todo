import { IsString, IsBoolean, IsOptional } from "class-validator";

export class CreateTodoDto {
  @IsString()
  title!: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}

export class UpdateTodoDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
