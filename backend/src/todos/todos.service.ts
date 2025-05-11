import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Todo } from "./schemas/todo.schema";
import { CreateTodoDto, UpdateTodoDto } from "./dto/todo.dto";
import { RedisService } from "@/shared/redis/redis.service";

@Injectable()
export class TodosService {
  constructor(
    @InjectModel(Todo.name) private readonly todoModel: Model<Todo>,
    private readonly redisService: RedisService
  ) {}

  private getCacheKey(userId: string): string {
    return `todos:${userId}`;
  }

  async getTodos(userId: string): Promise<Todo[]> {
    const cacheKey = this.getCacheKey(userId);
    const cached = await this.redisService.get<Todo[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const todos = await this.todoModel.find({ userId }).exec();
    await this.redisService.set(cacheKey, todos, 60); // TTL

    return todos;
  }

  async createTodo(
    createTodoDto: CreateTodoDto,
    userId: string
  ): Promise<Todo> {
    const newTodo = new this.todoModel({ ...createTodoDto, userId });
    const saved = await newTodo.save();

    await this.redisService.del(this.getCacheKey(userId));
    return saved;
  }

  async updateTodo(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const updatedTodo = await this.todoModel.findByIdAndUpdate(
      id,
      updateTodoDto,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTodo) {
      throw new NotFoundException("Todo not found");
    }

    await this.redisService.del(
      this.getCacheKey(updatedTodo.userId.toString())
    );
    return updatedTodo;
  }

  async deleteTodo(id: string): Promise<void> {
    const deletedTodo = await this.todoModel.findByIdAndDelete(id);
    if (!deletedTodo) {
      throw new NotFoundException("Todo not found");
    }
    await this.redisService.del(
      this.getCacheKey(deletedTodo.userId.toString())
    );
  }
}
