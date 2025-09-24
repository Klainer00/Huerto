document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('formRegistro');

    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const rutInput = document.getElementById('rut');
            const nombre = document.getElementById('nombre').value.trim();
            const apellido = document.getElementById('apellido').value.trim();
            const email = document.getElementById('email').value.trim();
            const direccion = document.getElementById('direccion').value.trim();
            const region = document.getElementById('region').value;
            const comuna = document.getElementById('comuna').value;
            const password = document.getElementById('psw').value;

            if (!rutInput.value.trim() || !nombre || !apellido || !email || !direccion || !region || !comuna || !password) {
                alert('Por favor, complete todos los campos requeridos.');
                return;
            }

            if (rutInput.validationMessage) {
                alert('El RUT ingresado no es válido.');
                return;
            }

            const emailRegex = /^[\w-\.]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
            if (!emailRegex.test(email)) {
                alert('El correo debe ser de dominio @duoc.cl, @profesor.duoc.cl o @gmail.com.');
                return;
            }
            
            alert('¡Usuario registrado con éxito!');
            form.reset();
            
        });
    }
});