// Conecto el socket para comunicarnos con el server
const socket = io();

const container = document.getElementById('container');

//Socket
socket.on('showProducts', (data) => {
    container.innerHTML = ``
    data.forEach(prod => {
        container.innerHTML += `
            <tr>
                <th scope="row"> ${prod._id} </th>
                <th scope="row"> ${prod.code} </th>
                <th scope="row"> ${prod.title}</th>
                <th scope="row"> ${prod.description}</th>
                <th scope="row"> ${prod.category} </th>
                <th scope="row"> ${prod.price}</th>
                <th scope="row"> ${prod.stock}</th>
                <th scope="row"> <img src="${prod.thumbnail}" alt="products" width="200" height="100"></th> 
                <th scope="row">
                    <button type="button" class="btn btncaja btn-warning" 
                        id="${prod._id}" onclick="procesDelId(id)">
                        Eliminar
                    </button>
                </th>
             </tr>
        `
    })
});

function delayNavigateOk(link) {
    if (!nIntervId) {
        nIntervId = setTimeout(() => {
            window.location.replace(link)
        }, 2500);
    };
};

function procesDelId(comp){
    
    const delProduct = document.getElementById(`${comp}`)
    if(delProduct){ 
        Swal.fire({
            title: `Está seguro de eliminar el producto? `,
            showCancelButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then(result =>{
            if (result.isConfirmed) {
                Swal.fire({
                    position: 'center',
                    title: 'Procesando ...',
                    showConfirmButton: false,
                  })
                id = result.value;
                fetch('/api/products/' + comp, {
                    method: 'DELETE'
                    })
                    .then((result) => {
                        if (result.status === 200) {
                            Swal.fire({
                                title: 'Producto Eliminado',
                                icon: 'success'
                            })
                            delayNavigateOk('/realTimeProducts');
                        }else{
                            if (result.status === 403) {
                                Swal.fire({
                                    position: 'top-end',
                                    icon: 'error',
                                    title: 'No cuenta con permisos para realizar dicha acción!',
                                    showConfirmButton: true,
                                })
                            }else {
                                Swal.fire({
                                    position: 'top-end',
                                    icon: 'error',
                                    title: 'Hubo un error al registrar la eliminición del producto, intente luego',
                                    showConfirmButton: true,
                                })                
                            }    
                        }
                    })
            }
       }); 
      
    }
};