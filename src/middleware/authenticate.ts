import "reflect-metadata";
import Boom from "@hapi/boom";
import express from "express";
import { Container } from "typedi";

import { UserService } from "../services/User";

export async function authenticate(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    let apiKey: string | null = null;

    const authHeader = (req.headers.authorization || '').split(' ');
    if (authHeader.length > 0) {
        // Pick the last part. This will make 'Bearer' optional.
        apiKey = authHeader[authHeader.length - 1];
    } else {
        apiKey = req.body.apikey || req.query.apikey;
    }

    if (!apiKey) {
        return next(Boom.unauthorized('API Key is required'));
    }

    try {
        const user = await Container.get(UserService).getUserByAPIKey(apiKey);
        req.user = user;

        return next();
    } catch (err) {
        return next(Boom.unauthorized('This API Key is unauthorized'));
    }
}
