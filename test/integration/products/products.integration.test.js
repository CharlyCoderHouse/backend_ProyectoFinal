import chai from 'chai';
import supertest from 'supertest';
import config from '../../../src/config/config';

const expect = chai.expect;
const requester = supertest(`http://${config.url_base}`);

describe('Testing Products', () => {

    let cookie;
    let productId;

    beforeEach(async function () {
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

    });

    it('Crear un producto correctamente ', async () => {
        const prodMock = {
            title: "Anillo Oro Prueba",
            description: "Descripción del anillo",
            price: 1500,
            code: 3000,
            stock: 22,
            category: "Joyeria",
            thumbnail: []
        };

        const { statusCode, ok, _body } = await requester.post('/api/products')
            .set('Cookie', [`${cookie.name}=${cookie.value}`]).send(prodMock);

        expect(statusCode).to.be.eql(200);
        expect(_body.payload).to.have.property('_id');
        productId=_body.payload._id;
    });

    it('Solo pueden crear un producto usuarios Admin o Premium', async () => {
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

        const prodMock = {
            title: "Anillo Oro Prueba",
            description: "Descripción del anillo",
            price: 1500,
            code: 3000,
            stock: 22,
            category: "Joyeria",
            thumbnail: []
        };

        const { statusCode, ok, _body } = await requester.post('/api/products')
            .set('Cookie', [`${cookie.name}=${cookie.value}`]).send(prodMock);

        expect(statusCode).to.be.eql(403);
    });

    it('Al crear un producto se debe corroborrar que los campos estén completos y debe retornar un bad request (400)', async () => {
        const prodMock = {
            title: "Anillo Oro Prueba",
            description: "Descripción del anillo",
            stock: 22,
            category: "Joyeria",
            thumbnail: []
        };

        const { statusCode, ok, _body } = await requester.post('/api/products')
            .set('Cookie', [`${cookie.name}=${cookie.value}`]).send(prodMock);

        expect(statusCode).to.be.eql(400);
    });

    it('El producto creado debe tener el campo OWNER con el correo del usuario que lo creo', async () => {
        const { statusCode, _body } = await requester.get(`/api/products/${productId}`).set('Cookie', [`${cookie.name}=${cookie.value}`]);

        expect(statusCode).to.be.eql(200);
        expect(_body.payload[0]).to.have.property('owner');
        expect(_body.payload[0].owner).to.be.eql('pp@gmail.com');
    });

    it('Actualizar un campo del producto correctamente, en este caso actualizo el stock', async () => {

        const productUpdated = {
            stock: 15
        };

        const putResult = await requester.put(`/api/products/${productId}`).set('Cookie', [`${cookie.name}=${cookie.value}`]).send(productUpdated);

        expect(putResult.statusCode).to.be.eql(200);
        expect(putResult._body.payload).to.be.eql(`El producto con ID ${productId} fue actualizado con éxito!`);

    });

    it('Elimino el producto de pruebas y valido que no exista', async () => {

        const deleteResult = await requester.delete(`/api/products/${productId}`).set('Cookie', [`${cookie.name}=${cookie.value}`]);

        expect(deleteResult.statusCode).to.be.eql(200);

        const getResult = await requester.get(`/api/products/${productId}`).set('Cookie', [`${cookie.name}=${cookie.value}`]);

        const products = getResult._body.payload;

        expect(products.find(product => product._id === productId)).to.be.eql(undefined);
    });

});