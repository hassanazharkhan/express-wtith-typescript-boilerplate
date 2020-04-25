import { Router } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

export class DocsController {
    private router: Router;
    private swaggerDoc: object;

    constructor() {
        this.router = Router();
        this.configureSwagger();
        this.routes();
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
            apis: ['./src/controllers/*.ts', './src/controllers/*.yml'],
        });
    }
    public routes(): void {
        this.router.use('/docs', swaggerUI.serve);
        this.router.get('/docs', swaggerUI.setup(this.swaggerDoc));
    }
}
