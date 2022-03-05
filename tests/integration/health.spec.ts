import { Application } from 'express';
import request from 'supertest';

import { Container } from 'typedi';

import { App } from '../../src/app';

describe('Integration Test', () => {
  let expressApplication: Application;

  beforeAll(() => {
    expressApplication = Container.get(App).expressApplication;
  });

  it('Health Check', async () => {
    const response = await request(expressApplication)
      .get('/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.message).toEqual('Hello World');
  });
});
