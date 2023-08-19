import chai from 'chai';
import supertest from 'supertest';
import { responseMessages } from '../../../src/helpers/proyect.helpers.js';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe('Testing Carts', () => {
    let cookie;
    let cartId;
    const productId1='6462c9be47a73882e9b795a7';
    const productId2='64656aecddd463b7221293b1';
    
    // LOGUEO al USER y OBTENGO EL carrito asociado al user
    beforeEach(async function () {

        const credentialsMock = {
            email: 'karloz_23@hotmail.com',
            password: '1234'
        };

        const loginResult = await requester.post('/api/sessions/login').send(credentialsMock);
        const cookieResult = loginResult.headers['set-cookie'][0];
        const cookieResultSplit = cookieResult.split('=');

        cookie = {
            name: cookieResultSplit[0],
            value: cookieResultSplit[1]
        };

        const { _body } = await requester.get('/api/sessions/current').set('Cookie', [`${cookie.name}=${cookie.value}`]);

        cartId=_body.payload.cart;

    });

    it('Agrego un producto con cantidad = 2 al carrito del usuario.', async () => {
        const cartMock = {
            quantity: 2
        };
        
        const { statusCode, ok, _body } = await requester.put(`/api/carts/${cartId}/product/${productId1}`).set('Cookie', [`${cookie.name}=${cookie.value}`]).send(cartMock);
        
        expect(statusCode).to.be.eql(200);
        expect(_body).to.have.property('payload');
        expect(_body.payload).to.be.eql('Se actualizo correctamente el producto al carrito');

    });

    it('Los usuarios ADMIN NO pueden cargar productos a un carrito.', async () => {

        const credentialsMock = {
            email: 'pp@gmail.com',
            password: '1234'
        };

        const loginResult = await requester.post('/api/sessions/login').send(credentialsMock);
        const cookieResult = loginResult.headers['set-cookie'][0];
        const cookieResultSplit = cookieResult.split('=');

        cookie = {
            name: cookieResultSplit[0],
            value: cookieResultSplit[1]
        };

        const cartMock = {
            quantity: 2
        };
        
        const { statusCode, ok, _body } = await requester.put(`/api/carts/${cartId}/product/${productId1}`).set('Cookie', [`${cookie.name}=${cookie.value}`]).send(cartMock);
        
        expect(statusCode).to.be.eql(403);
        expect(_body.error).to.be.eql(responseMessages.not_permissions);

    });

    it('Agrego un segundo producto y lo elimino del carrito.', async () => {
        const cartMock = {
            quantity: 1
        };
        
        const product = await requester.put(`/api/carts/${cartId}/product/${productId2}`).set('Cookie', [`${cookie.name}=${cookie.value}`]).send(cartMock);
   
        expect(product.statusCode).to.be.eql(200);

        const { statusCode, _body } = await requester.delete(`/api/carts/${cartId}/product/${productId2}`).set('Cookie', [`${cookie.name}=${cookie.value}`]);
        
        expect(statusCode).to.be.eql(200);
        expect(_body.payload.modifiedCount).to.be.eql(1);

    });

    it('Finzalizo la compra del carrito generando el ticket de compra', async () => {
        const { statusCode, _body } = await requester.put(`/api/carts/${cartId}/purchase`).set('Cookie', [`${cookie.name}=${cookie.value}`]);

        expect(statusCode).to.be.eql(200);
        expect(_body.payload).to.be.ok;

    });

    it('Al Finalizar la compra si un producto NO tiene stock no se realiza la compra y queda en el carrito', async () => {
        const { statusCode, _body } = await requester.put(`/api/carts/${cartId}/purchase`).set('Cookie', [`${cookie.name}=${cookie.value}`]);

        expect(statusCode).to.be.eql(404);
        expect(_body.status).to.have.eql('NOT FOUND');

    });
});