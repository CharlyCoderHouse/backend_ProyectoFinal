let nIntervId;

function delayNavigateOk(link) {
    if (!nIntervId) {
        nIntervId = setTimeout(() => {
            window.location.replace(link)
        }, 2500);
    };
};

const form = document.getElementById('resetForm');

if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        const data = new FormData(form);
        const obj = {};
        data.forEach((value, key) => obj[key] = value);
        Swal.fire({
            position: 'center',
            title: 'Enviando mail ...',
            showConfirmButton: false,
          })
        fetch('/api/sessions/password_link', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(result => {
            console.log(result.status);
            if (result.status === 200) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Se envío mail para el reseteo de contraseña',
                    showConfirmButton: true,
                  })
    
                delayNavigateOk('/');
            }else{
                if (result.status === 400) {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: 'El usuario no existe, por favor registrese',
                        showConfirmButton: true,
                    })
                }else{
                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: 'Hay datos incompletos, vuelva a intentarlo',
                        showConfirmButton: true,
                    })                
                }    
            }
        });
    });
}
