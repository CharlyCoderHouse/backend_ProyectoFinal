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
                <th scope="row"> <button class="btn btn-secondary" value="${prod.id}" id="butDel"> Eliminar </button>
            </tr>
        `
    })
});
delProd = document.getElementById('butDel')
delProd.addEventListener('click', (event) => {
  event.preventDefault();
 /*      fetch('http://localhost:8080/api/products/' + delProd.value, {
        method: 'DELETE',
        }).then(res => console.log(res)) */
        alert("Queres eliminar");
});

butAdd.addEventListener('submit', (event) => {
    event.preventDefault();
});