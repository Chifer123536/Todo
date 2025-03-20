import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from "@nestjs/common";
import { TodosService } from "./todos.service";
import { CreateTodoDto, UpdateTodoDto } from "./dto/todo.dto";

@Controller("todos")
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  async getTodos() {
    return this.todosService.getTodos();
  }

  @Post()
  async createTodo(@Body() createTodoDto: CreateTodoDto) {
    return this.todosService.createTodo(createTodoDto);
  }

  @Put(":id")
  async updateTodo(
    @Param("id") id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todosService.updateTodo(id, updateTodoDto);
  }

  @Delete(":id")
  async deleteTodo(@Param("id") id: string) {
    return this.todosService.deleteTodo(id);
  }
}
