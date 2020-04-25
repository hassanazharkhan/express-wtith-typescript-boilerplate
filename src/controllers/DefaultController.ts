import { Response, Request } from "express";
import {JsonController, Req, Res, Get } from "routing-controllers";

@JsonController()
export class DefaultController {
    @Get("/")
    public helathCheck(@Req() req: Request, @Res() res: Response): Response<unknown> {
        return res.send({ message: 'Hello World' });
    }
}
