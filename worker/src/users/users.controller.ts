import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create-users.dto';
import { JWtGuard } from '../auth/guard/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JWtGuard)
  async createUsers(@Body() createUsers: CreateUsersDto[]) {
    const createdUsers = await this.usersService.createUser(createUsers);
    return {
      message: 'Users received and saved successfully',
      count: createdUsers.length,
    };
  }
}
