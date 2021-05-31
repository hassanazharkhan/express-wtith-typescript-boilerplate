import { Container } from 'typedi';

import { App } from './app';

const application = Container.get(App);
void application.startExpressServer();
