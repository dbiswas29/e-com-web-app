import { Controller } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor() {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    Object.assign(user, createUserDto);
    return user;
  }

  // other methods like findAll, findOne, remove etc.
}

@Controller('users')
export class UsersController {}