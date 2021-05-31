import 'reflect-metadata';
import Boom from '@hapi/boom';
import { Service } from 'typedi';
import { getConnection } from 'typeorm';

import { ToDoList } from '../models/to-do-list';

@Service()
export class ToDoListService {
  public async getToDoListsForUser(userId: string, offset: number, limit: number): Promise<[ToDoList[], number]> {
    const toDoListRepo = getConnection().getRepository(ToDoList);

    return toDoListRepo.findAndCount({
      skip: offset,
      take: limit,
      where: { userId },
    });
  }

  public async getToDoList(toDoListId: string): Promise<ToDoList> {
    const toDoListRepo = getConnection().getRepository(ToDoList);

    const list = await toDoListRepo.findOne({
      where: { id: toDoListId },
    });

    if (!list) {
      throw Boom.notFound('Todo list not found');
    }

    return list;
  }

  public async createToDoListForUser(userId: string, title: string): Promise<ToDoList> {
    const toDoListRepo = getConnection().getRepository(ToDoList);

    const toDoList = toDoListRepo.create({
      userId,
      title,
    });

    return toDoListRepo.save(toDoList);
  }

  public async updateToDoList(toDoList: ToDoList): Promise<ToDoList> {
    const toDoListRepo = getConnection().getRepository(ToDoList);

    return toDoListRepo.save(toDoList, { reload: true });
  }

  public async removeToDoList(toDoList: ToDoList): Promise<ToDoList> {
    const toDoListRepo = getConnection().getRepository(ToDoList);

    return toDoListRepo.remove(toDoList);
  }
}
