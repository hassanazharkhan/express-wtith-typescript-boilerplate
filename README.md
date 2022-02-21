[![Dependency Status](https://david-dm.org/Microsoft/TypeScript-Node-Starter.svg)](https://david-dm.org/Microsoft/TypeScript-Node-Starter) [![Build Status](https://travis-ci.org/Microsoft/TypeScript-Node-Starter.svg?branch=master)](https://travis-ci.org/Microsoft/TypeScript-Node-Starter)

### A Dockerized Nodejs Express Boilerplate with TypeScript

#### Why

The main idea behind this app is that, We like you to be focused on your business and not spending hours in project configuration.

Give this a try!! We are more than happy to hear your feedback or feature request.

---

#### About

A comprehensive template. Works out of the box for most Node.js projects with following pieces

- [Docker] as the container service to isolate the environment.
- [Node.js](Long-Term-Support Version) as the run-time environment to run JavaScript.
- [Express.js]as the server framework / controller layer
- [Postgre SQL]as the database layer
- [TypeORM] as the "ORM" / model layer
- [TypeDI] Dependency Injection for TypeScript.
- [Routing-Controllers] Create structured, declarative and beautifully organized class-based controllers with heavy decorators usage in Express using TypeScript and Routing Controllers Framework.
- [Helmet] Helmet helps you secure your Express apps by setting various HTTP headers. It’s not a silver bullet, but it can help!
- [Swagger] API Tool to describe and document your api

---

#### Features

- TypeScript
- ESLint with some initial rules recommendation
- Jest for fast unit testing and code coverage
- Type definitions for Node.js and Jest
- NPM scripts for common operations
- Simple example of TypeScript code and unit test
- Example configuration for GitHub Actions

---

#### Docker

> **_NOTE:_** Not recommended for windows user

- Clone the repository
- Run `docker-compose up`

#### Without Docker

- Clone the repository
- Run `npm install`
- Run `npm run typeorm schema:sync`
- Run `npm run typeorm migration:run`\*
- Run `npm i ts-node -g`
- Run `npm run dev`

> **_NOTE:_**

    You need to install postgreSQL manually for the installation guide [follow link]
    (https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)
    And see the defaults in config.ts.

\* You need to set environment variables to provide configuration for database connection. Please see `src/config.ts` for environment variable names.

---

After the server is setup, you will be provided with an API Key on the terminal.
The API will be useable from the documentation available at http://localhost:3000/docs.

---

### Available Scripts

- `clean` - remove coverage data, Jest cache and transpiled files,
- `build` - transpile TypeScript to ES6,
- `build:watch` - interactive watch mode to automatically transpile source files,
- `lint` - lint source files and tests,
- `test` - run tests,
- `test:watch` - interactive watch mode to automatically re-run tests
- `watch` - automatically restart the application when file changes in the directory are detected

### License

[MIT](/LICENSE)
