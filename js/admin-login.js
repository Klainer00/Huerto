document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('admin-login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('admin-email').value;
        const password = document.getElementById('admin-password').value;
        const errorDiv = document.getElementById('error-message-admin');

        
        fetch('../data/usuarios.json')
            .then(response => response.json())
            .then(data => {
                const usuarios = data.usuarios;

                const usuarioEncontrado = usuarios.find(user => 
                    user.email === email && 
                    user.password === password && 
                    user.rol === 'Administrador'
                );

                if (usuarioEncontrado) {
                    alert(`¡Bienvenido, ${usuarioEncontrado.nombre}!`);
                    localStorage.setItem('adminLogueado', 'true');
                    localStorage.setItem('adminInfo', JSON.stringify(usuarioEncontrado));
                    window.location.href = 'usuarios.html';
                } else {
                    errorDiv.textContent = 'Credenciales incorrectas o no tiene permisos de administrador.';
                    errorDiv.classList.remove('d-none');
                }
            })
            .catch(error => {
                console.error('Error al cargar el archivo de usuarios:', error);
                errorDiv.textContent = 'Error al verificar las credenciales. Intente más tarde.';
                errorDiv.classList.remove('d-none');
            });
    });
});