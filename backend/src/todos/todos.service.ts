import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo } from './schemas/todo.schema';
import { CreateTodoDto, UpdateTodoDto } from './dto/todo.dto';
import { RedisService } from '@/shared/redis/redis.service';

@Injectable()
export class TodosService {
  private readonly logger = new Logger(TodosService.name);

  private readonly TTL = parseInt(process.env.REDIS_TODOS_TTL || '60');

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

    if (cached) return cached;

    const todos = await this.todoModel.find({ userId }).lean();
    await this.redisService.set(cacheKey, todos, this.TTL);

    return todos;
  }

  async createTodo(
    createTodoDto: CreateTodoDto,
    userId: string
  ): Promise<Todo> {
    const newTodo = new this.todoModel({ ...createTodoDto, userId });
    const saved = await newTodo.save();

    // Если кэш есть — обновим его, иначе просто удалим
    const cacheKey = this.getCacheKey(userId);
    const cached = await this.redisService.get<Todo[]>(cacheKey);
    if (cached) {
      await this.redisService.set(
        cacheKey,
        [...cached, saved.toObject()],
        this.TTL
      );
    } else {
      await this.redisService
        .del(cacheKey)
        .catch((err) =>
          this.logger.error(`Redis del error (create) for ${userId}`, err)
        );
    }

    return saved;
  }

  async updateTodo(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const updatedTodo = await this.todoModel.findByIdAndUpdate(
      id,
      updateTodoDto,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedTodo) throw new NotFoundException('Todo not found');

    await this.redisService
      .del(this.getCacheKey(updatedTodo.userId.toString()))
      .catch((err) =>
        this.logger.error(
          `Redis del error (update) for ${updatedTodo.userId}`,
          err
        )
      );

    return updatedTodo;
  }

  async deleteTodo(id: string): Promise<void> {
    const deletedTodo = await this.todoModel.findByIdAndDelete(id);
    if (!deletedTodo) throw new NotFoundException('Todo not found');

    await this.redisService
      .del(this.getCacheKey(deletedTodo.userId.toString()))
      .catch((err) =>
        this.logger.error(
          `Redis del error (delete) for ${deletedTodo.userId}`,
          err
        )
      );
  }
}

/*
  - Сервис для управления задачами.
  - Использует MongoDB (Mongoose) для CRUD-операций и Redis для кэширования списка задач.
  - Методы:
     • getTodos(userId): возвращает список задач из Redis или MongoDB;
     • createTodo(dto, userId): создаёт задачу, обновляет или очищает кэш;
     • updateTodo(id, dto): обновляет задачу, инвалидирует кэш;
     • deleteTodo(id): удаляет задачу, инвалидирует кэш.
  - Ключ кэша строится как "todos:{userId}", где userId — идентификатор пользователя.
  - Redis используется для ускорения отдачи списка задач — особенно при частых запросах.
*/
