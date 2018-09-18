const request = require('supertest');
const id = process.env.TEST_CLIENT_ID;
const secret = process.env.TEST_CLIENT_SECRET;

describe('testing proxy', () => {
  let server;

  before(function () {
    server = require('./app');
  });

  after(function () {
    server.close();
  });
  for (let i = 0; i < 2; i++) { // run twice to test caching
    it(`graphQL me(), run ${i}`, (done) => {
      request(server)
        .post('/graphql')
        .auth(id, secret)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/graphql')
        .send('query { me { id } }')
        .expect(200, { data: { me: { id: id } } }, done);
    });
  }
});
