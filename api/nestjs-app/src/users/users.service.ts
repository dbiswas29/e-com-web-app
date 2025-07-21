import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../auth/dto/create-user.dto';

@Injectable()
export class UsersService {
  private users: { username: string; password: string }[] = [];

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    // Hash password and store user securely in production!
    this.users.push({
      username: createUserDto.username,
      password: createUserDto.password,
    });
  }

  async validateUserPassword(loginUserDto: { username: string; password: string }) {
    const user = this.users.find(u => u.username === loginUserDto.username && u.password === loginUserDto.password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return user;
  }
}