let nIntervId;

function delayNavigateOk(link) {
    if (!nIntervId) {
        nIntervId = setTimeout(() => {
            window.location.replace(link)
        }, 2500);
    };
};

const form = document.getElementById('loginForm');

form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    fetch('/api/sessions/login', {
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
                title: 'Bienvenid@',
                showConfirmButton: true,
              })

            delayNavigateOk('/home');
        }else{
            if (result.status === 400) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'El usuario no existe, por favor registrese',
                    showConfirmButton: true,
                })
            }else if (result.status === 401) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'La contraseña es incorrecta, vuelva a intentarlo',
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