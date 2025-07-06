import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { Todo, TodoSchema } from './schemas/todo.schema';
import { RedisModule } from '@/shared/redis/redis.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
    RedisModule
  ],
  controllers: [TodosController],
  providers: [TodosService]
})
export class TodosModule {}
