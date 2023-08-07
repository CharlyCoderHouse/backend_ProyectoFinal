let nIntervId;

function delayNavigateOk() {
    if (!nIntervId) {
        nIntervId = setInterval(navigateOk, 2000);
    };
};

function navigateOk() {
    window.location.replace('/');
};

const formPass = document.getElementById('passForm');

if (formPass) {
    formPass.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = new FormData(formPass);
        const obj = {};
        data.forEach((value, key) => obj[key] = value);
        Swal.fire({
            position: 'center',
            title: 'cambiando contraseña ..',
            showConfirmButton: false,
          })
        fetch('/api/sessions/changePassword', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(result => {     
            if (result.status === 200) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'La contraseña fue cambiada con exito',
                    showConfirmButton: true,
                  })
    
                delayNavigateOk();
                //window.location.replace('/');
            }else{
                if (result.status === 401) {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: 'La contraseña debe ser distinta a la actual.',
                        showConfirmButton: true,
                    })
                }else{
                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: 'No se pudo actualizar la contraseña',
                        showConfirmButton: true,
                    })                
                }    
            }
        });
    });
}