import 'reflect-metadata';
import Boom from '@hapi/boom';
import { Service } from 'typedi';
import { getConnection } from 'typeorm';

import { User } from '../models/users';

@Service()
export class UserService {
  public async getAllUsers(offset: number, limit: number, select: (keyof User)[] = ['id', 'username']): Promise<[User[], number]> {
    const userRepo = getConnection().getRepository(User);

    return userRepo.findAndCount({
      take: limit,
      skip: offset,
      select,
    });
  }

  public async getUser(username: string): Promise<User> {
    const userRepo = getConnection().getRepository(User);

    const user = await userRepo.findOne({
      where: [
        { id: username },
        { username },
      ],
    });

    if (!user) {
      throw Boom.notFound('Could not find a user with this username or id');
    }

    return user;
  }

  public async getUserByAPIKey(apiKey: string): Promise<User> {
    const userRepo = getConnection().getRepository(User);

    const user = await userRepo.findOne({
      where: { apiKey },
    });

    if (!user) {
      throw Boom.notFound('Could not find a user with this API Key');
    }

    return user;
  }

  public async getUserAPIKey(username: string): Promise<string> {
    const user = await this.getUser(username);

    return user.apiKey;
  }

  public async createUser(username: string): Promise<User> {
    const userRepo = getConnection().getRepository(User);

    const user = userRepo.create({ username });
    await userRepo.save(user);

    return user;
  }

  public async deleteUser(username: string): Promise<void> {
    const userRepo = getConnection().getRepository(User);

    const user = await this.getUser(username);

    await userRepo.delete(user);
  }
}
