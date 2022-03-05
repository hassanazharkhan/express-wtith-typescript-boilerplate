import 'reflect-metadata';
import Boom from '@hapi/boom';
import Joi from '@hapi/joi';
import { Response, Request } from 'express';
import { JsonController, Req, Res, Get, Post, Delete, UseBefore, Put } from 'routing-controllers';

import { Authenticate } from '../middleware/authenticate';
import { DesignationService } from '../services/designation';

@JsonController()
@UseBefore(Authenticate)
export class DesignationController {
  constructor(
    private designationService: DesignationService) {}

  @Get('/designation')
  public async getDesignationForUser(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const { limit, offset } = await Joi
      .object({
        offset: Joi.number().integer().default(0).failover(0),
        limit: Joi.number().integer().default(10).failover(10),
      })
      .validateAsync({
        offset: req.query.offset,
        limit: req.query.limit,
      });

    const [lists, total] = await this.designationService.getDesignationForUser(req.user.id, offset, limit);

    return res.send({
      total,
      data: lists.map((list) => ({ id: list.id, name: list.name })),
    });
  }

  @Post('/designation')
  public async createDesignationForUser(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const { name } = await Joi
      .object({
        name: Joi.string().min(3).max(255).required(),
      })
      .validateAsync({
        name: req.body.name,
      });

    const list = await this.designationService.createDesignationForUser(req.user.id, name);


    return res.status(201).send({ id: list.id, title: list.name });
  }

  @Put('/designation/:designationId')
  public async updateDesignation(@Req() req: Request, @Res() res: Response): Promise<Response> {
    //  const { designationId: incomingId } = req.params;
    const { designationId, name } = await Joi
      .object({
        designationtId: Joi.string().uuid().required(),
        name: Joi.string().min(3).max(255).required(),
      })
      .validateAsync({
        designationId: req.params.designationId,
        name: req.body.name,

      });
    // eslint-disable-next-line no-console
    console.log();

    let list = await this.designationService.getDesignation(designationId);
    // eslint-disable-next-line no-console

    if (list.userId !== req.user.id) {
      throw Boom.forbidden('You do not have access to this resource');
    }

    list.name = name;
    list = await this.designationService.updateDesignation(list);

    return res.send({ id: list.id, name: list.name });
  }

  @Delete('/designation/:designationId')
  public async removeDesignation(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const { designationId } = await Joi
      .object({
        designationId: Joi.string().uuid().required(),
      })
      .validateAsync({
        designationId: req.params.designationId,
      });

    const list = await this.designationService.getDesignation(designationId);
    if (list.userId !== req.user.id) {
      throw Boom.forbidden('You do not have access to this resource');
    }

    await this.designationService.removeDesignation(list);

    return res.send(204);
  }
}
