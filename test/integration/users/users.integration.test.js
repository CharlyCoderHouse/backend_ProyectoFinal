import chai from 'chai';
import supertest from 'supertest';
import { PRIVATE_COOKIE } from '../../../src/helpers/proyect.constants.js';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe('Testing Users', () => {
    let cookie;

    it('Se registra un usuario de Prueba correctamente', async() => {
        const userMock = {
            first_name: 'Prueba Testing',
            last_name: 'Coder',
            email: 'cdiblasi@coder.com',
            password: '1234'
        };

        const { statusCode, _body } = await requester.post('/api/sessions/register').send(userMock);
        expect(statusCode).to.be.eql(200);
        expect(_body).to.be.ok;
    });

    it('Debemos loguear al usuario y retornar una cookie', async () => {
        const credentialsMock = {
            email: 'cdiblasi@coder.com',
            password: '1234'
        };

        const loginResult = await requester.post('/api/sessions/login').send(credentialsMock);
        const cookieResult = loginResult.headers['set-cookie'][0];

        expect(cookieResult).to.be.ok;

        const cookieResultSplit = cookieResult.split('=');

        cookie = {
            name: cookieResultSplit[0],
            value: cookieResultSplit[1]
        };

        expect(cookie.name).to.be.ok.and.eql(PRIVATE_COOKIE);
        expect(cookie.value).to.be.ok;
    });

    it('Debemos enviar una cookie en el servicio current y entregar la información al usuario', async() => {
        const { _body } = await requester.get('/api/sessions/current')
            .set('Cookie', [`${cookie.name}=${cookie.value}`]);

        expect(_body.payload.email).to.be.eql('cdiblasi@coder.com');
    });

    it('Elimino el usuario de prueba y el carrito asociado', async() => {
        const { _body } = await requester.get('/api/sessions/current')
            .set('Cookie', [`${cookie.name}=${cookie.value}`]);
            
        const id = String(_body.payload._id);
        const cartId = String(_body.payload.cart);

        //Elimino el carrito asociado al usuario de prueba
        const deleteCart = await requester.delete(`/api/carts/delete/${cartId}`);

        expect(deleteCart.statusCode).to.be.eql(200);

        const deleteResult = await requester.delete(`/api/users/delete/${id}`);

        expect(deleteResult.statusCode).to.be.eql(200);
    });

});