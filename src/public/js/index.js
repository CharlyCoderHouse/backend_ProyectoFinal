// Selector de Categoría
const categSel = document.getElementById('categSel1')
if(categSel){
    categSel.addEventListener('change', () => {
    if (categSel.options[categSel.selectedIndex].value === "c6" ){
        window.location= "/api/products";
    }else{
        const query = categSel.options[categSel.selectedIndex].text;
        window.location= "/api/products?query="+`${query}`;
    }; 
 }); 
}; 

// Selector de Orden de precio
const ordPri = document.getElementById('ordPri')
if(ordPri){
    ordPri.addEventListener('change', () => {
    let sort ="";
    if (ordPri.options[ordPri.selectedIndex].value === "v2" ){
        sort = 1; 
    }else if (ordPri.options[ordPri.selectedIndex].value === "v3" ){  
        sort = -1;
    } 
    window.location= "/api/products?sort="+`${sort}`;
 }); 
}; 
// Botón para ir al HOME
let goHome = document.getElementById('goHome')
if(goHome){
    goHome.addEventListener('click', (event) => {
        window.location= "/";
    });
}
// Botón para agregar productos
const addProduct = document.getElementById('addProduct')
if(addProduct){
    addProduct.addEventListener('click', (event) => {
        window.location= "/realTimeProducts";
    });
}
// Botón para ver lista de productos
const viewProduct = document.getElementById('viewProduct')
if(viewProduct){
    viewProduct.addEventListener('click', (event) => {
        window.location= "/api/products";
    });
}

// Botón para ir al chat
const viewChat = document.getElementById('viewChat')
if(viewChat){
    viewChat.addEventListener('click', (event) => {
        window.location= "/chat";
    });
}

// Botón para ver el carrito de prueba
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

// Botón para insertar en carro
function procesoId(comp){
    const id = comp.id
    //console.log("1 " + id);
    const butCart = document.getElementById(`${id}`)
    if(butCart){ 
        Swal.fire({
            title: 'Muy buena eleccion',
            text: 'Ingrese la cantidad a pedir',
            input: 'text',
            inputValidator: (value) =>{
                return !value && "Ingrese la cantidad a pedir";
            },
            showCancelButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: 'Agregar al Carrito'
        }).then(async result =>{
            //console.log(result);
            if (result.isConfirmed) {
                /* console.log(result.value);
                console.log(id); */
                const obj=`{"quantity": ${result.value}}`;
                //console.log("obj.", obj); 
                const prueba = await fetch('/api/sessions/current', {
                    method: 'GET'
                });
                const data = await prueba.json();
                const cart =data.payload.cart;
                const cartId='/api/carts/'+cart+'/product/'+id
                //console.log(cartId);
                fetch(cartId, {
                    method: 'PUT',
                    body: obj,
                    headers: {
                        'Accept': "application/json",
                        'Content-Type': 'application/json; charset=UTF-8'
                    }
                })
                .then((result) => {
                    //console.log(result.status);
                    if (result.status === 200) {
                        Swal.fire({
                            title: 'Producto Agregado al Carrito',
                            icon: 'success'
                        })
                    }else{
                        if (result.status === 401) {
                            Swal.fire({
                                position: 'top-end',
                                icon: 'error',
                                title: 'El producto seleccionado no puede agregarse al carrito, por ser usuario PREMIUM!',
                                showConfirmButton: true,
                            })
                        }else{
                            if (result.status === 403) {
                                Swal.fire({
                                    position: 'top-end',
                                    icon: 'error',
                                    title: 'No tiene permisos para agregar productos al carrito',
                                    showConfirmButton: true,
                                })}else {
                                    Swal.fire({
                                position: 'top-end',
                                icon: 'error',
                                title: 'Hubo un error al registrar el producto, intente luego',
                                showConfirmButton: true,
                            })}
                        }
                    }
                });
            }; 
        });
    };
};

// Botón para ver profile
const viewProfile = document.getElementById('viewProfile')
if(viewProfile) {
    viewProfile.addEventListener('click', (event) => {
        window.location= "/profile";
    });
};

// Botón para Administrar Users
const adminUser = document.getElementById('adminUsers')
if(adminUser) {
    adminUser.addEventListener('click', async (event) => {
        const prueba = await fetch('/api/users/usersadmin', {
            method: 'GET'
        })
        .then((result) => {
            console.log(result);
            if (result.status === 200) {
                window.location= "/api/users/usersadmin";
            }else{
                if (result.status === 403) {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: 'No tiene permisos para la Administración de Usuarios',
                        showConfirmButton: true,
                    })
                }
            }
        })
    });
};

// Botón para logout
const logout = document.getElementById('logout')
if(logout) {
    logout.addEventListener('click', (event) => {
        window.location= "/api/sessions/logout";
    });
};

let nIntervId;

const form = document.getElementById('productForm');

function delayNavigateOk() {
    if (!nIntervId) {
        nIntervId = setInterval(navigateOk, 2000);
    };
};
    
function navigateOk() {
    window.location.replace('/realTimeProducts');
};

function delayNavigateUser() {
    if (!nIntervId) {
        nIntervId = setInterval(navigateUser, 2000);
    };
};
    
function navigateUser() {
    window.location.replace('/api/users/usersadmin');
};

if(form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        const data = new FormData(form);
        const obj = {};
        data.forEach((value, key) => obj[key] = value);
        fetch('/api/products', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(result => {
            if (result.status === 200) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Producto creado con éxito',
                    showConfirmButton: true,
                })
                delayNavigateOk();
            }else{
                if (result.status === 400) {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: 'Los datos ingresados son incorrectos, vuelva a intentarlo!',
                        showConfirmButton: true,
                    })
                }else{
                    if (result.status === 501) {
                        Swal.fire({
                            position: 'top-end',
                            icon: 'error',
                            title: 'Ya existe el producto que quiere agregar!',
                            showConfirmButton: true,
                    })}else{       
                        if (result.status === 403) {
                            Swal.fire({
                                position: 'top-end',
                                icon: 'error',
                                title: 'No cuenta con permisos para realizar dicha acción!',
                                showConfirmButton: true,
                        })}else{
                            Swal.fire({
                                position: 'top-end',
                                icon: 'error',
                                title: 'Hay datos incompletos, vuelva a intentarlo',
                                showConfirmButton: true,
                            });
                        }
                    }
                }
            }
        });
    });
};

// Botón para Eliminar usuarios por inactividad
const deleteUsers = document.getElementById('deleteUsers')
if(deleteUsers) {
    deleteUsers.addEventListener('click', (event) => {
        Swal.fire({
            title: 'Eliminar Usuarios por Inactividad',
            text: 'Ingrese la cantidad de días de inactividad',
            input: 'number',
            inputValidator: (value) =>{
                return !value && "Ingrese la cantidad de días de inactividad";
            },
            showCancelButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: 'Eliminar'
        }).then(async result =>{
            if (result.isConfirmed) {
                Swal.fire({
                    position: 'center',
                    title: 'Enviando mail ...',
                    showConfirmButton: false,
                  })
                const obj=`{"day": ${result.value}}`;
                await fetch('delete', {
                    method: 'DELETE',
                    body: obj,
                    headers: {
                        'Accept': "application/json",
                        'Content-Type': 'application/json; charset=UTF-8'
                    }
                })
                .then((result) => {
                    console.log(result);
                    if (result.status === 200) {
                        Swal.fire({
                            title: 'Se eliminaron los usuarios correctamente',
                            icon: 'success',
                            timer: 2000
                        })
                        delayNavigateUser();
                    }else{       
                        if (result.status === 403) {
                            Swal.fire({
                                position: 'top-end',
                                icon: 'warning',
                                title: 'No se encontraron usuarios a eliminar!',
                                showConfirmButton: true,
                        })}else{
                            Swal.fire({
                                position: 'top-end',
                                icon: 'error',
                                title: 'Hubo un error al querer eliminar usuarios, intente luego',
                                showConfirmButton: true,
                            })
                        }
                    }
                })
            }        
        })        
    })
};

// Botón para Eliminar un usuario
function deleteUserId(comp){
    const id = comp.id;
    const delUser = document.getElementById(`${id}`)
    if(delUser){ 
        Swal.fire({
            title: `Está seguro de eliminar el usuario? `,
            icon: 'warning',
            input: 'text',
            inputLabel: "Ingrese el motivo de la eliminación!",
            inputValidator: (value) =>{
                return !value && 'Por favor ingrese un motivo';
            },
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!',
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then(async (result) =>{
            if (result.isConfirmed) {
                const obj= `{"motivo": "${result.value}"}`;
                console.log(obj);
                Swal.fire({
                    position: 'center',
                    title: 'Enviando mail ...',
                    showConfirmButton: false,
                  })
                const url='/api/users/delete/'+id
                await fetch(url, {
                    method: 'DELETE',
                    body: obj,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                    })
                    .then((result) => {
                        if (result.status === 200) {
                            Swal.fire({
                                title: 'Usuario Eliminado',
                                icon: 'success'
                            })
                            delayNavigateUser();
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
                                    title: 'Hubo un error al registrar la eliminición del usuario, intente luego',
                                    showConfirmButton: true,
                                })                
                            }    
                        }
                    })
            }
       }); 
    };
};

// Cambio de ROLE
function roleChangeUserId(comp){
    const id = comp.id;
    const roleUser = document.getElementById(`${id}`)
    if(roleUser){ 
        Swal.fire({
            title: 'Cambio de Role',
            text: 'Seleccione el role a cambiar',
            input: 'select', 
            inputOptions:{
                Admin: 'Admin',
                Premium: 'Premium',
                User: 'User'
            },
            showCancelButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: 'Aceptar'
        }).then(async (result) =>{
            if (result.isConfirmed) {
                const obj=`{"role": "${result.value}"}`;
                const url='/api/users/premium/'+id
                await fetch(url, {
                    method: 'POST',
                    body: obj,
                    headers: {
                        'Accept': "application/json",
                        'Content-Type': 'application/json; charset=UTF-8'
                    }
                })
                .then((result) => {
                    if (result.status === 200) {
                        Swal.fire({
                            title: 'Ha cambiado el role correctamente',
                            icon: 'success'
                        })
                        delayNavigateUser();
                    }else{
                        if (result.status === 403) {
                            Swal.fire({
                                position: 'top-end',
                                icon: 'error',
                                title: 'Para pasar a Premium debe completar los documentos requeridos!',
                            })
                        }else{
                            if (result.status === 404) {
                                Swal.fire({
                                    position: 'top-end',
                                    icon: 'warning',
                                    title: 'Esta asignando el mismo Role, verifique los datos ingresados!',
                                })
                            }else{
                            Swal.fire({
                                position: 'top-end',
                                icon: 'error',
                                title: 'Hubo un error al cambiar el role, intente luego',
                                showConfirmButton: true,
                                })
                            }
                        }    
                        
                    }
                })
            }
        }); 
    };
};


