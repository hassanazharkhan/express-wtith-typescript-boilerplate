/* eslint-disable @typescript-eslint/no-explicit-any */
import "reflect-metadata";
import { Server } from "http";

import bodyParser from "body-parser";
import express from 'express';
import bunyanMiddleware from "express-bunyan-logger";
import helmet from "helmet";
import {Container } from "typedi";
import { createConnection } from "typeorm";

import config from "./config";
import ErrorHandler from './middleware/errorHandler';
import { UserService } from "./services/User";
import { logger } from "./utils";

export class App {
  public readonly app: express.Application;
  private readonly userService: UserService;

  constructor(controllers: Array<any>) {
      this.app = express();
      this.userService = Container.get(UserService);

      this.initializeMiddleware();
      this.initializeControllers(controllers);
      this.initializeErrorhandler();
  }

  private initializeMiddleware(): void {
      this.app.use(helmet({ hidePoweredBy: true }));
      this.app.use(bodyParser.json());

      if (config.env !== 'test') {
          this.app.use(bunyanMiddleware({
              logger,
              parseUA: false,
              excludes: ['response-hrtime', 'req-headers', 'res-headers'],
              format: ':incoming :method :url :status-code',
          }));
      }
  }

  private initializeControllers(controllers: Array<any>): void {
      if (controllers.length) {
          controllers.forEach((controller: any) => {
              this.app.use('/', controller.router);
          });
      }
  }

  private initializeErrorhandler(): void {
      this.app.use(ErrorHandler);
  }

  public async startExpressServer(): Promise<Server> {
      const connection = await createConnection();
      const server = await this.app.listen(config.server.port);

      if (connection) {
          logger.info(`Hey! I'm connected to database...`);
      }

      if (server){
          logger.info(`Hey! I'm listening on port: ${config.server.port} ... API Documentation is available at /docs`);

          if (config.env === 'development') {
              // Log some API Keys for demo purposes...

              const [users, total] = await this.userService.getAllUsers(0, 3, ['username', 'apiKey']);
              if (total > 0) {
                  logger.debug('These are some API Keys that you may use for this demo:', users);
              } else {
                  logger.debug('Hey, I couldn\'t find any users in the database. You\'ll have to create some to test the API.');
              }
          }
      }

      return server;
  }
}
