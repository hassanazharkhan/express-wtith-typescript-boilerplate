import * as Logger from "bunyan";
import { User } from "src/models/user";

declare module 'express-serve-static-core' {
    interface Request {
        log: Logger;
        user?: User;
    }
}
