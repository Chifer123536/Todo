import { Module } from "@nestjs/common";
import { TodosService } from "./todos.service";
import { TodosController } from "./todos.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Todo, TodoSchema } from "./schemas/todo.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
  ],
  controllers: [TodosController],
  providers: [TodosService],
  exports: [TodosService], // если сервис используется в других модулях
})
export class TodosModule {}
