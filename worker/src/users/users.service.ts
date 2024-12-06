import { Injectable } from '@nestjs/common';
import { User } from './model/users.model';
import { UsersRepository } from './repository/users.repository';
import { CreateUsersDto } from './dto/create-users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(createUser: CreateUsersDto[]): Promise<User[]> {
    await this.usersRepository.deleteAll();
    const createdUsers = [];
    for (const user of createUser) {
      createdUsers.push(await this.usersRepository.create(user));
    }
    return createdUsers;
  }
  async findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }
}
