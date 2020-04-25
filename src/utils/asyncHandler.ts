import {Request, Response, NextFunction} from "express";

export function wrapAsync(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
    return async function(_req: Request, _res: Response, _next: NextFunction): Promise<void> {
        try {
            await fn(_req, _res, _next);
        } catch (err) {
            _next(err);
        }
    }
}
