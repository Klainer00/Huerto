document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form-modal');
    if (!loginForm) return;

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('modal-email').value;
        const password = document.getElementById('modal-password').value;
        const errorDiv = document.getElementById('error-message-modal');

        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        
        const usuarioEncontrado = usuarios.find(u => u.email === email && u.password === password);

        if (usuarioEncontrado) {
            localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioEncontrado));
            window.location.reload();
        } else {
            errorDiv.textContent = 'Correo o contraseña incorrectos.';
            errorDiv.classList.remove('d-none');
        }
    });
});