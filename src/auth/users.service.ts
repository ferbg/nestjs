// users.service.ts
import { Injectable } from '@nestjs/common';
export type User = any;

@Injectable()
export class UsersService {
  private readonly users: User[];
  constructor() {
    this.users = [
      {
        userId: 1,
        username: 'john',
        // password: 'changeme',
        password: '$2b$10$Io7K92LEPAL4Bg4cl/FYguLyxVbvUjepLrZVtNOu3pkbaOdzLshya',
        roles: ['admin'],
      },
      {
        userId: 2,
        username: 'maria',
        password: 'guess',
        roles: ['user'],
      },
    ];
  }
  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
