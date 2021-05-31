import 'reflect-metadata';
import Boom from '@hapi/boom';
import Joi from '@hapi/joi';
import { Response, Request } from 'express';
import { JsonController, Req, Res, Get, Post, Delete, UseBefore, Put } from 'routing-controllers';

import { Authenticate } from '../middleware/authenticate';
import { ToDoItemService, ToDoListService } from '../services';

@JsonController()
@UseBefore(Authenticate)
export class ToDoListController {
  constructor(
    private toDoItemService: ToDoItemService,
    private toDoListService: ToDoListService) {}

  @Get('/todos')
  public async getToDoListsForUser(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const { limit, offset } = await Joi
      .object({
        offset: Joi.number().integer().default(0).failover(0),
        limit: Joi.number().integer().default(10).failover(10),
      })
      .validateAsync({
        offset: req.query.offset,
        limit: req.query.limit,
      });

    const [lists, total] = await this.toDoListService.getToDoListsForUser(req.user.id, offset, limit);

    return res.send({
      total,
      data: lists.map((list) => ({ id: list.id, title: list.title })),
    });
  }

  @Post('/todos')
  public async createToDoListForUser(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const { title, items } = await Joi
      .object({
        title: Joi.string().min(3).max(255).required(),
        items: Joi.array().items(Joi.string().min(3).max(255)),
      })
      .validateAsync({
        title: req.body.title,
        items: req.body.items,
      });

    const list = await this.toDoListService.createToDoListForUser(req.user.id, title);

    await this.toDoItemService.addTodoItems(list.id, items);

    return res.status(201).send({ id: list.id, title: list.title });
  }

  @Put('/todos/:todolistId')
  public async updateToDoList(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const { todolistId, title } = await Joi
      .object({
        todolistId: Joi.string().uuid().required(),
        title: Joi.string().min(3).max(255).required(),
      })
      .validateAsync({
        todolistId: req.params.todolistId,
        title: req.body.title,
      });

    let list = await this.toDoListService.getToDoList(todolistId);
    if (list.userId !== req.user.id) {
      throw Boom.forbidden('You do not have access to this resource');
    }

    list.title = title;
    list = await this.toDoListService.updateToDoList(list);

    return res.send({ id: list.id, title: list.title });
  }

  @Delete('/todos/:todolistId')
  public async removeToDoList(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const { todolistId } = await Joi
      .object({
        todolistId: Joi.string().uuid().required(),
      })
      .validateAsync({
        todolistId: req.params.todolistId,
      });

    const list = await this.toDoListService.getToDoList(todolistId);
    if (list.userId !== req.user.id) {
      throw Boom.forbidden('You do not have access to this resource');
    }

    await this.toDoListService.removeToDoList(list);

    return res.send(204);
  }
}
