import { Response, Request } from 'express';
import { JsonController, Req, Res, Get } from 'routing-controllers';


@JsonController()
export class DefaultController {
  @Get('/')
  public healthCheck(@Req() _req: Request, @Res() res: Response): Response {
    return res.send({ message: 'Hello World' });
  }
}
