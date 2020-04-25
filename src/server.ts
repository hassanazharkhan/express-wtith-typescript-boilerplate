import { Container } from "typedi";

import { App } from './app';

const application = Container.get(App);
application.startExpressServer();
