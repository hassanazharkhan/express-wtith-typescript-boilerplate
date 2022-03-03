/* eslint-disable no-console */
import { Application } from 'express';
import request from 'supertest';

import { Container } from 'typedi';

import { App } from '../../src/app';

describe('To do', () => {
  let expressApplication: Application;

  beforeAll(() => {
    expressApplication = Container.get(App).expressApplication;
  });
  it('Should return error while calling the api create endpoint without apiKey', async () => {
    const data = { title: 'some-title', item: ['some', 'items'] };
    const response = await request(expressApplication)
      .post('/todos')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401);
    expect(response.body.message).toEqual('API Key is required');
  });

  it('Should create the todo list', async () => {
    const data = { title: 'some-title', items: ['some', 'items'] };
    const response = await request(expressApplication)
      .post('/todos')
      .set({ accept: 'application/json', authorization: '' })
      .send(data)
      .expect('Content-Type', /json/)
      .expect(201);

    console.log(response.body);

    //expect(response.body.message).toEqual('API Key is required');
  });
});
