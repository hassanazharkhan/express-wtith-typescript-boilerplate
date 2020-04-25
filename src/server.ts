import { App } from './app';
import { DefaultController, DocsController, ToDoItemController, ToDoListController } from "./controllers";

const application = new App([
    new DefaultController(),
    new DocsController(),
    new ToDoItemController(),
    new ToDoListController()]
);

application.startExpressServer();
