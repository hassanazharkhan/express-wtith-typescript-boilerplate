import 'reflect-metadata';
import Boom from '@hapi/boom';
import { Request, Response, NextFunction } from 'express';
import { ExpressMiddlewareInterface } from 'routing-controllers';
import { Inject } from 'typedi';

import { UserService } from '../services';

export class Authenticate implements ExpressMiddlewareInterface {
  @Inject()
  private readonly userService: UserService

  async use(req: Request, _res: Response, next: NextFunction): Promise<void> {
    let apiKey: string | null = null;

    const authHeader = (req.headers.authorization || '').split(' ');
    if (authHeader.length > 0) {
      // Pick the last part. This will make 'Bearer' optional.
      apiKey = authHeader[authHeader.length - 1];
    } else {
      apiKey = req.body.apikey || req.query.apikey;
    }

    if (!apiKey) {
      console.log(apiKey);
      return next(Boom.unauthorized('API Key is required'));
    }

    try {
      const user = await this.userService.getUserByAPIKey(apiKey);
      req.user = user;

      return next();
    } catch (err) {
      return next(Boom.unauthorized('This API Key is unauthorized'));
    }
  }
}
