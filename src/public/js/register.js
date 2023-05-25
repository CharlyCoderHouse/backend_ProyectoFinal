let nIntervId;

function delayNavigateRegister() {
    if (!nIntervId) {
        nIntervId = setInterval(navigateToRegister, 3000);
    };
};

function navigateToRegister() {
    window.location.replace('/register');
};

function delayNavigateOk() {
    if (!nIntervId) {
        nIntervId = setInterval(navigateOk, 3000);
    };
};

function navigateOk() {
    window.location.replace('/');
};

const form = document.getElementById('registerForm');

form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    fetch('/api/sessions/register', {
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
                title: 'El registro fue exitoso, ya puede ingresar su login',
                showConfirmButton: true,
              })
            delayNavigateOk();
            //window.location.replace('/');
        }else{
            if (result.status === 400) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'El usuario ya existe, vuelva a intentarlo',
                    showConfirmButton: true,
                })
            }else{
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Hay campos incompletos, vuelva a intentarlo',
                    showConfirmButton: true,
                })
            }
            delayNavigateRegister();
            //window.location.replace('/register');
        }

    });
});