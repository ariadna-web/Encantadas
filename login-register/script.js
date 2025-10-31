//bendita animacion 
const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

registerBtn.addEventListener('click', () => {
    container.classList.add('active');
});

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
});


// Registro de usuario
const registerForm = document.getElementById('registerForm');
if(registerForm){
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            alert(result.mensaje);
        } catch(err) {
            console.error(err);
            alert('Error en registro');
        }
    });
}

// Login de usuario
const loginForm = document.getElementById('loginForm');
if(loginForm){
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if(response.ok){
                window.location.href = 'pagina.html';
            } else {
                alert(result.mensaje);
            }
        } catch(err) {
            console.error(err);
            alert('Error en login');
        }
    });
}

