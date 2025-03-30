import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthoRized } from "@/auth/decorators/authorized.decorator";
import { Authorization } from "@/auth/decorators/auth.decorator";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Get("profile")
  public async findFrofile(@AuthoRized("id") userId: string) {
    return this.userService.findById(userId);
  }
}
