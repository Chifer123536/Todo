import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Req,
} from "@nestjs/common";
import { Request } from "express";
import { TodosService } from "./todos.service";
import { CreateTodoDto, UpdateTodoDto } from "./dto/todo.dto";

@Controller("todos")
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  async getTodos(@Req() req: Request) {
    return this.todosService.getTodos(req.session.userId);
  }

  @Post()
  async createTodo(@Body() dto: CreateTodoDto, @Req() req: Request) {
    return this.todosService.createTodo(dto, req.session.userId);
  }

  @Put(":id")
  async updateTodo(@Param("id") id: string, @Body() dto: UpdateTodoDto) {
    return this.todosService.updateTodo(id, dto);
  }

  @Delete(":id")
  async deleteTodo(@Param("id") id: string) {
    return this.todosService.deleteTodo(id);
  }
}
