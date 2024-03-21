import chai from "chai";
import supertest from "supertest";
import { app } from '../app.js'; 

const expect = chai.expect;
const request = supertest(app);

describe('Router Usuario', () => {
    const nuevoUser = {
        first_name: "Magali",
        last_name: "Lascano",
        email: "magalilascano@example.com",
        age: 30,
        password: "password123",
        cart: {} 
    };

    let userId;
    let authToken;

    it('POST /api/sessions/register: debe agregar un nuevo usuario', async () => {
        const response = await request.post('/api/sessions/register').send(nuevoUser);

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('status', 'success');
        expect(response.body).to.have.property('message', 'Usuario registrado');
        expect(response.body).to.have.property('token');
        expect(response.body).to.have.property('payload');

        userId = response.body.payload._id;
        authToken = response.body.token;
    });

    it('POST /api/sessions/login: debe iniciar sesión', async () => {
        const { email, password } = nuevoUser;
        const response = await request.post('/api/sessions/login').send({ email, password });
    
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('status', 'success');
        expect(response.body).to.have.property('message', 'Inició sesión');
        expect(response.body).to.have.property('payload');
        expect(response.headers['set-cookie']).to.be.an('array').that.satisfies(cookies => {
            return cookies.some(cookie => cookie.includes('tokenCookie='));
        });

        authToken = response.headers['set-cookie'][0].split(';')[0].split('=')[1];
    });

    it('POST /api/sessions/logout: debe cerrar sesión', async () => {
        const response = await request
            .post('/api/sessions/logout')
            .set('Cookie', `tokenCookie=${authToken}`);

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('status', 'success');
        expect(response.body).to.have.property('message', 'Sesión cerrada');
    });
});
