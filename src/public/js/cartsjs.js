// Botón para ver lista de productos
const viewProduct = document.getElementById('viewProduct')
if(viewProduct){
    viewProduct.addEventListener('click', (event) => {
        window.location= "/api/products";
    });
}

// Botón para ir al HOME
let goHome = document.getElementById('goHome')
if(goHome){
    goHome.addEventListener('click', (event) => {
        window.location= "/";
    });
}

let nIntervId;

function delayNavigateCart() {
    if (!nIntervId) {
        nIntervId = setInterval(navigateCart, 2000);
    };
};
    
function navigateCart() {
    window.location.reload();
};

// Botón para Eliminar un usuario
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
                    console.log(result);
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