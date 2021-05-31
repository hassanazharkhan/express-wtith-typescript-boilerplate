import { MigrationInterface, getRepository } from 'typeorm';

import { User } from '../models/users';

export class Seed1580070688033 implements MigrationInterface {
  public async up(): Promise<void> {
    const user = getRepository(User).create({
      username: 'user1',
    });

    await getRepository(User).save(user);
  }

  public async down(): Promise<void> {
    const user = await getRepository(User).findOne({
      where: { username: 'user1' },
    });

    await getRepository(User).remove(user);
  }
}
