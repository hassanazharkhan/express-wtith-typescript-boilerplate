/* eslint-disable @typescript-eslint/no-explicit-any */
import "reflect-metadata";
import { Server } from "http";

import bodyParser from "body-parser";
import express from 'express';
import bunyanMiddleware from "express-bunyan-logger";
import helmet from "helmet";
import { useExpressServer, useContainer as routingUseContainer } from "routing-controllers";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import { Inject, Container } from "typedi";
import { createConnection, useContainer as typeormUseContainer } from "typeorm";

import config from "./config";
import ErrorHandler from './middleware/errorHandler';
import { UserService } from "./services";
import { logger } from "./utils";

export class App {
  public readonly expressApplication: express.Application;
  private swaggerDoc: object;

  @Inject()
  private readonly userService: UserService

  constructor() {
      this.expressApplication = express();

      this.initializeMiddleware();
      this.configureSwagger();
      this.initializeSwagger()
      this.configureDependencyInjection()
      this.initializeControllers();
      this.initializeErrorhandler();
  }

  private initializeMiddleware(): void {
      this.expressApplication.use(helmet({ hidePoweredBy: true }));
      this.expressApplication.use(bodyParser.json());

      if (config.env !== 'test') {
          this.expressApplication.use(bunyanMiddleware({
              logger,
              parseUA: false,
              excludes: ['response-hrtime', 'req-headers', 'res-headers'],
              format: ':incoming :method :url :status-code',
          }));
      }
  }

  private configureSwagger(): void {
      this.swaggerDoc = swaggerJSDoc({
          definition: {
              openapi: '3.0.0',
              info: {
                  title: 'Swagger Examples',
                  version: '1.0.0',
              },
          },
          apis: ['./src/spec/*.yml'],
      });
  }

  private initializeSwagger(): void {
      this.expressApplication.use('/docs', swaggerUI.serve);
      this.expressApplication.get('/docs', swaggerUI.setup(this.swaggerDoc));
  }

  private configureDependencyInjection(): void {
      routingUseContainer(Container);
      typeormUseContainer(Container);
  }

  private initializeControllers(): void {
      useExpressServer(this.expressApplication, {
          controllers: [__dirname + "/controllers/*.ts"],
      });
  }

  private initializeErrorhandler(): void {
      this.expressApplication.use(ErrorHandler);
  }

  public async startExpressServer(): Promise<Server> {
      const connection = await createConnection();
      const server = await this.expressApplication.listen(config.server.port);

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
