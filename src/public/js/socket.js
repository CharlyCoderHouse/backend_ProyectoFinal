// Conecto el socket para comunicarnos con el server
const socket = io();

const container = document.getElementById('container');
const butAdd = document.getElementById('butAdd');

//Socket
socket.on('showProducts', data => {
    container.innerHTML = ``
    data.forEach(prod => {
        container.innerHTML += `
            <tr>
                <th scope="row"> ${prod.code} </th>
                <th scope="row"> ${prod.title}</th>
                <th scope="row"> ${prod.description}</th>
                <th scope="row"> ${prod.category} </th>
                <th scope="row"> ${prod.price}</th>
                <th scope="row"> ${prod.stock}</th>
                <th scope="row"> ${prod.thumbnail}</th>
                <th scope="row"> <button type="submit" class="btn btn-secondary" value="${prod.id}" id="butDel"> Eliminar </button>
            </tr>
        `
    })
});

const delProd = document.getElementById('butDel')
delProd.addEventListener('submit', (event) => {
    event.preventDefault();
});

butAdd.addEventListener('submit', (event) => {
    event.preventDefault();
});