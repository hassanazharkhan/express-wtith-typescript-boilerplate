import request from 'supertest';
import { DesignationController } from 'src/controllers/designation';
//jest.mock('../../src/controllers/designation.ts');

describe('designation', ()=>{
  it('should add designation to the list', ()=>{

    const newDesignation = { id: 1, name: 'one' };
    const expected =
      { id: 1, name: 'one' };


    const result = DesignationController.prototype.createDesignationForUser(request.u, newDesignation.name);
    expect(result).toEqual(expected);
  });
});
// import { Application } from 'express';
// import request from 'supertest';

// import { Container } from 'typedi';

// import { App } from '../../src/app';
// import { DesignationController } from 'src/controllers/designation';
// describe('To do', () => {
//   let expressApplication: Application;

//   beforeAll(() => {
//     expressApplication = Container.get(App).expressApplication;
//   });

//   it('create designation', async ()=>{
//     const newDesignation = { id: 1, name: 'one' };
//     const response= await request(expressApplication)
//       .post('/designation')
//       .set({ accept: 'application/json', authorization: 'Bearer 83cb2116-9f12-4af3-a206-e8d7d3a3e9cb' })
//       .send(newDesignation)
//       .expect('Content-Type', /json/)
//       .expect(201);

//     // eslint-disable-next-line no-console
//     console.log(response.body);

//     // const expected =
//     //   { id: 1, name: 'one' };

//     // const result = DesignationController.prototype.createDesignationForUser(newDesignation.id, newDesignation.name);
//     // expect(result).toEqual(expected);

//   });

// });