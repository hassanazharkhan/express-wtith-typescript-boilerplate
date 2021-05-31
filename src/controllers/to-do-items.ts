import 'reflect-metadata';
import Boom from '@hapi/boom';
import Joi from '@hapi/joi';
import { Response, Request } from 'express';
import { JsonController, Req, Res, Get, Post, Patch, Delete, UseBefore } from 'routing-controllers';

import { Authenticate } from '../middleware/authenticate';
import { ToDoItemService, ToDoListService } from '../services';
import { logger } from '../utils';

@JsonController()
@UseBefore(Authenticate)
export class ToDoItemController {
  constructor(
    private toDoItemService: ToDoItemService,
    private toDoListService: ToDoListService) {}

  @Get('/todos/:todolistId/items')
  public async getToDoList(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const { limit, offset, todolistId } = await Joi
      .object({
        offset: Joi.number().integer().default(0).failover(0),
        limit: Joi.number().integer().default(10).failover(10),
        todolistId: Joi.string().uuid().required(),
      })
      .validateAsync({
        offset: req.query.offset,
        limit: req.query.limit,
        todolistId: req.params.todolistId,
      });

    const list = await this.toDoListService.getToDoList(todolistId);
    if (list.userId !== req.user.id) {
      throw Boom.forbidden('You do not have access to this resource');
    }

    const [items, total] = await this.toDoItemService.getTodoItemsForUser(req.user.id, todolistId, offset, limit);

    return res.send({
      total,
      data: items.map((item) => ({ id: item.id, completed: item.completed, description: item.description })),
    });
  }

  @Post('/todos/:todolistId/items')
  public async addTodoItems(@Req() req: Request, @Res() res: Response): Promise<Response> {
    logger.info('todolistId', req.params.todolistId);
    const { todolistId, items } = await Joi
      .object({
        todolistId: Joi.string().uuid().required(),
        items: Joi.array().items(
          Joi.string().min(3).max(255),
        ).min(1).required(),
      })
      .validateAsync({
        todolistId: req.params.todolistId,
        items: req.body,
      });
    const list = await this.toDoListService.getToDoList(todolistId);
    if (list.userId !== req.user.id) {
      throw Boom.forbidden('You do not have access to this resource');
    }
    const _items = await this.toDoItemService.addTodoItems(todolistId, items);
    return res.status(201).send(_items.map((item) => ({ id: item.id, completed: item.completed, description: item.description })));
  }

  @Patch('/items')
  public async updateTodoItemsForUser(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const { items } = await Joi
      .object({
        items: Joi.array().items(
          Joi.object({
            id: Joi.string().uuid().required(),
            description: Joi.string().min(3).max(255),
            completed: Joi.bool(),
          }),
        ).min(1).required(),
      })
      .validateAsync({
        items: req.body,
      });

    const _items = await this.toDoItemService.updateTodoItemsForUser(req.user.id, items);

    return res.send(_items.map((item) => ({ id: item.id, completed: item.completed, description: item.description })));
  }

  @Delete('/items')
  public async removeTodoItemsForUser(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const { itemIds } = await Joi
      .object({
        itemIds: Joi.array().items(
          Joi.string().uuid(),
        ).min(1).required(),
      })
      .validateAsync({
        itemIds: req.body,
      });

    await this.toDoItemService.removeTodoItemsForUser(req.user.id, itemIds);
    return res.send(204);
  }
}
