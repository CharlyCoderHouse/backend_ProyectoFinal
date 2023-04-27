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
                <th scope="row"> ${prod.id} </th>
                <th scope="row"> ${prod.code} </th>
                <th scope="row"> ${prod.title}</th>
                <th scope="row"> ${prod.description}</th>
                <th scope="row"> ${prod.category} </th>
                <th scope="row"> ${prod.price}</th>
                <th scope="row"> ${prod.stock}</th>
                <th scope="row"> ${prod.thumbnail}</th>
            </tr>
        `
    })
});

butAdd.addEventListener('submit', (event) => {
    event.preventDefault();
}); 

let id = ""; 
const delAdd = document.getElementById('delProd');
delAdd.addEventListener('click', (event) => {
    Swal.fire({
        title: 'Ingrese el ID a eliminar',
        input: 'text',
        inputValidator: (value) =>{
            return !value && "Necesitas escribir un ID para eliminar";
        }
    }).then(result =>{
        id = result.value;
        fetch('http://localhost:8080/api/products/' + id, {
            method: 'DELETE'
            })
            .then((response) => response.json())
            .then((data) => {
                Swal.fire({
                    title: 'Producto Eliminado',
                    icon: 'success'
                })
            })
    }); 
}); 