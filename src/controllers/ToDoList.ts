import "reflect-metadata";

import Boom from "@hapi/boom";
import Joi from "@hapi/joi";
import { Router, Request, Response } from "express";
import {Container } from "typedi";

import { authenticate } from "../middleware";
import { ToDoItemService } from "../services/ToDoItem";
import { ToDoListService } from "../services/ToDoList";
import { wrapAsync } from "../utils/asyncHandler";

export class ToDoListController {
    constructor() {
        this.router = Router();
        this.toDoItemService = Container.get(ToDoItemService);
        this.toDoListService = Container.get(ToDoListService);
        this.routes();
    }

    private router: Router;
    private toDoItemService: ToDoItemService;
    private toDoListService: ToDoListService;

    public routes(): void {
        /**
         * @swagger
         * /todos:
         *   get:
         *     tags:
         *       - Todolist
         *     summary: List
         *     description: Returns paginated Todo list
         *     security:
         *       - APIKeyHeader: []
         *       - APIKeyQuery: []
         *     parameters:
         *       - $ref: '#/components/parameters/offset'
         *       - $ref: '#/components/parameters/limit'
         *     responses:
         *       200:
         *         description: OK
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/TodolistPagination'
         *             example:
         *               total: 2
         *               data:
         *                 - id: c43a3b0d-e794-4a9c-9c12-e35c6b62de4c
         *                   title: Vacation Preparation
         *                 - id: 2efa52e2-e9fd-4bd0-88bc-0132b2e837d9
         *                   title: Final Year Project
         *       401:
         *         $ref: '#/components/responses/UnauthorizedError'
         *       500:
         *         $ref: '#/components/responses/InternalError'
         */
        this.router.get('/todos', wrapAsync(authenticate), wrapAsync(async (req: Request, res: Response) => {
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

            res.send({
                total,
                data: lists.map((list) => ({ id: list.id, title: list.title })),
            });
        }));

        /**
         * @swagger
         * /todos:
         *   post:
         *     tags:
         *       - Todolist
         *     summary: Create
         *     description: Create a Todo list with Todo items
         *     security:
         *       - APIKeyHeader: []
         *       - APIKeyQuery: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - title
         *             properties:
         *               title:
         *                 description: Todolist title
         *                 type: string
         *                 minimum: 3
         *                 maximum: 255
         *               items:
         *                 description: Todoitems for the new todolist
         *                 type: array
         *                 items:
         *                   description: Todoitem description
         *                   type: string
         *                   minimum: 3
         *                   maximum: 255
         *     responses:
         *       201:
         *         description: Created
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Todolist'
         *             example:
         *               id: c43a3b0d-e794-4a9c-9c12-e35c6b62de4c
         *               title: Vacation Preparation
         *       400:
         *         $ref: '#/components/responses/BadRequestError'
         *       401:
         *         $ref: '#/components/responses/UnauthorizedError'
         *       500:
         *         $ref: '#/components/responses/InternalError'
         */
        this.router.post('/todos', wrapAsync(authenticate), wrapAsync(async (req: Request, res: Response) => {
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

            res.status(201).send({ id: list.id, title: list.title });
        }));

        /**
         * @swagger
         * /todos/{todolistId}:
         *   put:
         *     tags:
         *       - Todolist
         *     summary: Update
         *     description: Update a Todo list
         *     security:
         *       - APIKeyHeader: []
         *       - APIKeyQuery: []
         *     parameters:
         *       - $ref: '#/components/parameters/todolistId'
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *            schema:
         *              type: object
         *              required:
         *                - title
         *              properties:
         *                title:
         *                  description: Todolist title
         *                  type: string
         *                  minimum: 3
         *                  maximum: 255
         *     responses:
         *       200:
         *         description: Updated
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Todolist'
         *             example:
         *               id: c43a3b0d-e794-4a9c-9c12-e35c6b62de4c
         *               title: Vacation Preparation
         *       400:
         *         $ref: '#/components/responses/BadRequestError'
         *       401:
         *         $ref: '#/components/responses/UnauthorizedError'
         *       403:
         *         $ref: '#/components/responses/ForbiddenError'
         *       404:
         *         $ref: '#/components/responses/NotFoundError'
         *       500:
         *         $ref: '#/components/responses/InternalError'
         */
        this.router.put('/todos/:todolistId', wrapAsync(authenticate), wrapAsync(async (req: Request, res: Response) => {
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

            res.send({ id: list.id, title: list.title });
        }));

        /**
         * @swagger
         * /todos/{todolistId}:
         *   delete:
         *     tags:
         *       - Todolist
         *     summary: Delete
         *     description: Delete a Todo list
         *     security:
         *       - APIKeyHeader: []
         *       - APIKeyQuery: []
         *     parameters:
         *       - $ref: '#/components/parameters/todolistId'
         *     responses:
         *       204:
         *         description: Deleted
         *       400:
         *         $ref: '#/components/responses/BadRequestError'
         *       401:
         *         $ref: '#/components/responses/UnauthorizedError'
         *       403:
         *         $ref: '#/components/responses/ForbiddenError'
         *       404:
         *         $ref: '#/components/responses/NotFoundError'
         *       500:
         *         $ref: '#/components/responses/InternalError'
         */
        this.router.delete('/todos/:todolistId', wrapAsync(authenticate), wrapAsync(async (req: Request, res: Response) => {
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

            res.send(204);
        }));
    }
}
