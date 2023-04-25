// Conecto el socket para comunicarnos con el server
const socket = io();

const container = document.getElementById('container');

//Socket
socket.on('showProducts', data => {
    container.innerHTML = ``

    data.forEach(prod => {
        container.innerHTML += `
        <div class="table-responsive tabla">
            <table class="table table-success table-striped">
                <thead>
                    <tr>
                        <th scope="col"> Código </th>
                        <th scope="col"> Nombre </th>
                        <th scope="col"> Descripción </th>
                        <th scope="col"> Categoría </th>
                        <th scope="col"> Precio </th>
                        <th scope="col"> Stock </th>
                        <th scope="col"> Imagen </th>
                        <th scope="col"> Eliminar </th>
                    </tr>
                </thead>
                <tbody>
                    {{#each products}}
                        <tr>
                            <th scope="row"> ${prod.code} </th>
                            <th scope="row"> ${prod.title}</th>
                            <th scope="row"> ${prod.description}</th>
                            <th scope="row"> ${prod.category} </th>
                            <th scope="row"> ${prod.price}</th>
                            <th scope="row"> ${prod.stock}</th>
                            <th scope="row"> ${prod.thumbnail}</th>
                            <th scope="row"> <button id="prodDelete"> Eliminar</button></th>
                        </tr>
                    {{/each}}
                </tbody>
            </table>    
        </div>
        `
    })
});
const  delProd = document.getElementById('prodDelete')
delProd.addEventListener('click', (event) => {
    window.location= "/api/products";
});