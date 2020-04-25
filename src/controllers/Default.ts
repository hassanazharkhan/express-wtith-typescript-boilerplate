import express, { Router } from "express";

import { wrapAsync } from "../utils";

export class DefaultController {
    constructor() {
        this.router = Router();
        this.routes();
    }

    private router: Router;

    public routes(): void {
        /**
         * @swagger
         * /:
         *   get:
         *     tags:
         *       - Default
         *     summary: Health check
         *     description: Returns 'Hello World' if the server has started.
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         description: OK
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Message'
         *             example:
         *               message: Hello World
         *       500:
         *         $ref: '#/components/responses/InternalError'
         */

        this.router.get('/', wrapAsync(async (req: express.Request, res: express.Response) => {
            res.send({ message: 'Hello World' });
        }));
    }
}
