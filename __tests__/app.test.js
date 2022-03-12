const request = require('supertest');

const app = require('../server');

describe('cardnao-explorer', () => {
    it('returns status code 200 if endpoint successfully exposed', async () => {
        const res = await request(app).get('/query/cardano-explorer');

        expect(res.statusCode).toEqual(200);
    });
});

describe('kovi', () => {
    it('returns status code 404 if endpoint not exposed', async () => {
        const res = await request(app).get('/query/kovi');

        expect(res.statusCode).toEqual(404);
    });
});

addr = 'addr_test1wzhfye4zxffxd59gg0fhjzavy7uuhpul04kr5myavevh29svlsrpc'
value = '4000000'

describe('contains an addr value', () => {
    it('returns an addr value', async () => {
        const res = await request(app).get('/query/cardano-explorer');
        console.log(res.body[0][1]);
        expect(res.body[0][1]).toEqual(`${addr}`);
    });
});

describe('contains a value', () => {
    it('returns a value', async () => {
        const res = await request(app).get('/query/cardano-explorer');
        console.log(res.body[0][1]);
        expect(res.body[0][2]).toEqual(`${value}`);
    });
});