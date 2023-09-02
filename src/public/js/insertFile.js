// Botón para ir al HOME
let goHome = document.getElementById('goHome')
if(goHome){
    goHome.addEventListener('click', (event) => {
        event.preventDefault();
        window.location= "/";
    });
}

// Botón para ir al SALIR
let goExit = document.getElementById('goExit')
if(goExit){
    goExit.addEventListener('click', (event) => {
        event.preventDefault();
        window.location= "/api/sessions/logout";
    });
};

let nIntervId;

function delayNavigateProfile() {
    if (!nIntervId) {
        nIntervId = setInterval(navigateProfile, 2000);
    };
};
    
function navigateProfile() {
    window.location.replace('/profile');
};

const fileForm = document.getElementById('fileInputForm');

if(fileForm) {
    function fileUserId(comp){
        const id = comp.id;
        fileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = new FormData(fileForm);
            const url = `/api/users/${id}/documents`
            await fetch(url, {
                method: 'POST',
                body: data,
            }).then(result => {
                if (result.status === 200) {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Archivos ingresados con Exito',
                        showConfirmButton: true,
                    })
                }else{
                    if (result.status === 401) {
                        Swal.fire({
                            position: 'top-end',
                            icon: 'error',
                            title: 'Error en el archivo a adjuntar.',
                            showConfirmButton: true,
                        })
                    }else{    
                        if (result.status === 404) {
                            Swal.fire({
                                position: 'top-end',
                                icon: 'error',
                                title: 'Error no se pudo actualizar el usuario, verifique los datos ingresados!',
                                showConfirmButton: true,
                        })}else{
                            Swal.fire({
                                position: 'top-end',
                                icon: 'error',
                                title: 'Error al cargar el archivo, verifique el nombre del post',
                                showConfirmButton: true,
                            });
                        }
                    }
                }
                delayNavigateProfile();
            });
        });
    }
};