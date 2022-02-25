import 'reflect-metadata';
import { Service } from 'typedi';
import { getConnection } from 'typeorm';

import { ToDoItem } from '../models/to-do-item';
import { logger } from '../utils';

@Service()
export class ToDoItemService {
  public async getTodoItemsForUser(userId: string, toDoListId: string, offset: number, limit: number): Promise<[ToDoItem[], number]> {
    const toDoItemRepo = getConnection().getRepository(ToDoItem);

    return toDoItemRepo.findAndCount({
      skip: offset,
      take: limit,
      where: { toDoList: { id: toDoListId, userId } },
    });
  }

  public async addTodoItems(toDoListId: string, items: string[]): Promise<ToDoItem[]> {
    const toDoItemRepo = getConnection().getRepository(ToDoItem);

    const toDoItems = items.map((description) => {
      return toDoItemRepo.create({
        toDoList: { id: toDoListId },
        description,
      });
    });

    return toDoItemRepo.save(toDoItems);
  }

  public async updateTodoItemsForUser(userId: string, items: ToDoItem[]): Promise<ToDoItem[]> {
    const toDoItemRepo = getConnection().getRepository(ToDoItem);

    const toDoItemIds = items
      .filter((item) => item.description != undefined || item.completed != undefined)
      .map((item) => item.id);

    if (!toDoItemIds.length) {
      return [];
    }

    const [_items, total] = await toDoItemRepo.createQueryBuilder('item')
      .leftJoin('item.toDoList', 'list')
      .whereInIds(toDoItemIds)
      .andWhere('list.userId = :userId', { userId })
      .getManyAndCount();

    for (const item of _items) {
      const newItem = items.find((i) => i.id == item.id);
      if (!newItem) {
        throw new Error('Unexpected behavior');
      }

      item.description = newItem.description;
      item.completed = newItem.completed;
    }

    const newItems = await toDoItemRepo.save(_items, { reload: true });
    logger.debug(`Updated ${total} items`);

    return newItems;
  }

  public async removeTodoItemsForUser(userId: string, toDoItemIds: string[]): Promise<number> {
    const toDoItemRepo = getConnection().getRepository(ToDoItem);

    if (!toDoItemIds.length) {
      return 0;
    }

    const [items, total] = await toDoItemRepo.createQueryBuilder('item')
      .leftJoin('item.toDoList', 'list')
      .whereInIds(toDoItemIds)
      .andWhere('list.userId = :userId', { userId })
      .getManyAndCount();

    await toDoItemRepo.remove(items);
    logger.debug(`Deleted ${total} items`);

    return total;
  }
}
