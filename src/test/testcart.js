import chai from "chai";
import supertest from "supertest";
import { app } from '../app.js'; 

const expect = chai.expect;
const request = supertest(app);

describe('Router Carrito', () => {
    const nuevoCarrito = {};

    it('POST /api/carts: debe agregar un nuevo carrito', async () => {
        const response = await request.post('/api/carts').send(nuevoCarrito);
            console.log('cart', response.body);
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('status', 'Succes');
        expect(response.body).to.have.property('message', 'Se creo el carrito correctamente');
        expect(response.body).to.have.property('updatedCart');
    });
});