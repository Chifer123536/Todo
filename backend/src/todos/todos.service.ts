import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Todo } from "./schemas/todo.schema";
import { CreateTodoDto, UpdateTodoDto } from "./dto/todo.dto";

@Injectable()
export class TodosService {
  constructor(
    @InjectModel(Todo.name) private readonly todoModel: Model<Todo>,
  ) {}

  async getTodos(): Promise<Todo[]> {
    return this.todoModel.find().exec();
  }

  async createTodo(createTodoDto: CreateTodoDto): Promise<Todo> {
    const newTodo = new this.todoModel(createTodoDto);
    return newTodo.save();
  }

  async updateTodo(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const updatedTodo = await this.todoModel.findByIdAndUpdate(
      id,
      updateTodoDto,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedTodo) {
      throw new NotFoundException("Todo not found");
    }

    return updatedTodo;
  }

  async deleteTodo(id: string): Promise<void> {
    const deletedTodo = await this.todoModel.findByIdAndDelete(id);
    if (!deletedTodo) {
      throw new NotFoundException("Todo not found");
    }
  }
}
