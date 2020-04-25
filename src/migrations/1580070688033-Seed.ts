import { MigrationInterface, QueryRunner, getRepository } from "typeorm";

import { User } from "../models/User";

export class Seed1580070688033 implements MigrationInterface {
    public async up(_queryRunner: QueryRunner): Promise<void> {
        const user = getRepository(User).create({
            username: 'user1',
        });

        await getRepository(User).save(user);
    }

    public async down(_queryRunner: QueryRunner): Promise<void> {
        const user = await getRepository(User).findOne({
            where: { username: 'user1' },
        });

        await getRepository(User).remove(user);
    }
}
