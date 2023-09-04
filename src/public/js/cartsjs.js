// Botón para ver lista de productos
const viewProduct = document.getElementById('viewProduct')
if(viewProduct){
    viewProduct.addEventListener('click', (event) => {
        window.location= "/api/products";
    });
};

// Botón para ir al HOME
let goHome = document.getElementById('goHome')
if(goHome){
    goHome.addEventListener('click', (event) => {
        window.location= "/";
    });
};

// Botón para ver el carrito 
const viewCart = document.getElementById('viewCart')
if(viewCart) {
    viewCart.addEventListener('click', async (event) => {
        const prueba = await fetch('/api/sessions/current', {
            method: 'GET'
        });
        const data = await prueba.json();
        const cart =data.payload.cart;
        window.location= "/api/carts/"+cart;
    });
};

let nIntervId;

function delayNavigateCart() {
    if (!nIntervId) {
        nIntervId = setTimeout(() => {
            window.location.reload()
        }, 3000);
    };
};
    
// Botón para Eliminar un producto del carrito
function deleteCartId(comp){
    const productId = comp.id;
    const cartComp = document.getElementsByName('cartId');
    const cartId = cartComp[0].id
    Swal.fire({
        title: `Está seguro de eliminar el producto del carrito? `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar!',
        allowOutsideClick: false,
        allowEscapeKey: false
    }).then(async (result) =>{
        if (result.isConfirmed) {
            const url='/api/carts/'+cartId+'/product/'+productId
            await fetch(url, {
                method: 'DELETE',
                })
                .then((result) => {
                    if (result.status === 200) {
                        Swal.fire({
                            title: 'Producto eliminado del carrito',
                            icon: 'success'
                        })
                        delayNavigateCart();
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

};

// Botón para Vaciar el Carrito
const deleteCart = document.getElementById('deleteCart')
if(deleteCart) {
    const cartComp = document.getElementsByName('cartId');
    const cartId = cartComp[0].id
    deleteCart.addEventListener('click', (event) => {
        Swal.fire({
            title: 'Vaciar Carrito',
            icon: 'warning',
            text: 'Esta seguro de eliminar todos los productos del carrito?',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!',
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then(async result =>{
            if (result.isConfirmed) {
                const url='/api/carts/'+cartId
                await fetch(url, {
                    method: 'DELETE',
                })
                .then((result) => {
                    
                    if (result.status === 200) {
                        Swal.fire({
                            title: 'Se vació el carrito correctamente',
                            icon: 'success'
                        })
                        delayNavigateCart();
                    }else{       
                        if (result.status === 403) {
                            Swal.fire({
                                position: 'top-end',
                                icon: 'warning',
                                title: 'No cuenta con permisos para realizar dicha acción!',
                                showConfirmButton: true,
                        })}else{
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
        })        
    })
};


function delayNavigateFin(link) {
    if (!nIntervId) {
        nIntervId = setTimeout(() => {
            window.location.replace(link)
        }, 4000);
    };
};

// Botón Finalizar la compra
const finalCart = document.getElementById('finalCart')
if(finalCart) {
    let ticketId;
    const cartComp = document.getElementsByName('cartId');
    const cartId = cartComp[0].id
    finalCart.addEventListener('click', (event) => {
        Swal.fire({
            title: 'Esta seguro de Finalizar su compra',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, voy a comprar!',
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then(async result =>{
            if (result.isConfirmed) {
                Swal.fire({
                    position: 'center',
                    title: 'Procesando tu pedido ...',
                    showConfirmButton: false,
                  })
                const url='/api/carts/'+cartId+"/purchase"
                await fetch(url, {
                    method: 'POST',
                })
                .then((response) =>
                    response.json()
                )
                .then((json) => {
                    ticketId = json.ticketId;
                    if (json.status === 200) {
                        if (json.sinStock){
                            Swal.fire({
                                title: 'Algunos productos están sin Stock, pero se pudo procesar una parte del pedido',
                                text: 'Revise su compra y el carrito resultante de los productos sin stock',
                                icon: 'success',
                                timer: 4000
                            })
                        }else{
                            Swal.fire({
                                title: 'Muchas gracias por su compra',
                                icon: 'success',
                                timer: 4000
                            })
                        }
                        
                        delayNavigateFin(`/api/carts/purchase/${ticketId}`);
                    }else{       
                        if (json.status === 404) {
                            Swal.fire({
                                position: 'top-end',
                                icon: 'warning',
                                title: 'No hay productos disponibles para la compra!',
                                showConfirmButton: true,
                        })}else{
                            Swal.fire({
                                position: 'top-end',
                                icon: 'error',
                                title: 'Hubo un error al registrar al realizar la compra, intente luego',
                                showConfirmButton: true,
                            })
                        }
                    };
                })       
            }        
        })
    })
};