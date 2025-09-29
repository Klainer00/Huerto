document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formRegistroModal');
    if (!form) return;

    const rutInput = document.getElementById('reg-rut');
    const nombre = document.getElementById('reg-nombre');
    const apellido = document.getElementById('reg-apellido');
    const email = document.getElementById('reg-email');
    const password = document.getElementById('reg-psw');
    const f_nacimiento = document.getElementById('reg-fecha_nacimiento');
    const direccion = document.getElementById('reg-direccion');
    const region = document.getElementById('reg-region');
    const comuna = document.getElementById('reg-comuna');
    const setValidationState = (input, isValid, message) => {
        const feedback = input.nextElementSibling; 
        if (isValid) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
        } else {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
            if (feedback) feedback.textContent = message;
        }
    };
    const validateRequired = (input, fieldName) => {
        const isValid = input.value.trim() !== '';
        setValidationState(input, isValid, `El campo ${fieldName} es requerido.`);
        return isValid;
    };
    const validateEmail = () => {
        const emailRegex = /^[\w-\.]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
        const isValid = emailRegex.test(email.value.trim());
        setValidationState(email, isValid, 'Email inválido o no permitido.');
        return isValid;
    };
    const validateFecha = () => {
        const fechaIngresada = new Date(f_nacimiento.value);
        const fechaMinima = new Date('1900-01-01');
        const fechaMaxima = new Date();
        fechaIngresada.setDate(fechaIngresada.getDate() + 1);
        const isValid = f_nacimiento.value && fechaIngresada <= fechaMaxima && fechaIngresada >= fechaMinima;
        setValidationState(f_nacimiento, isValid, 'La fecha debe ser válida (entre 1900 y hoy).');
        return isValid;
    };
    const validateRut = () => {
        checkRut(rutInput); 
        const isValid = !rutInput.validationMessage;
        setValidationState(rutInput, isValid, rutInput.validationMessage);
        return isValid;
    }
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const isNombreValid = validateRequired(nombre, 'nombre');
        const isApellidoValid = validateRequired(apellido, 'apellido');
        const isDireccionValid = validateRequired(direccion, 'dirección');
        const isRegionValid = validateRequired(region, 'región');
        const isComunaValid = validateRequired(comuna, 'comuna');
        const isPasswordValid = validateRequired(password, 'contraseña');
        const isEmailValid = validateEmail();
        const isFechaValid = validateFecha();
        const isRutValid = validateRut();
        if (isNombreValid && isApellidoValid && isDireccionValid && isRegionValid && isComunaValid && isPasswordValid && isEmailValid && isFechaValid && isRutValid) {
            
            let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            const usuarioExistente = usuarios.find(u => u.email === email.value || u.rut === rutInput.value);

            if (usuarioExistente) {
                alert('El correo electrónico o el RUT ya se encuentran registrados.');
                return;
            }
            const nuevoUsuario = {
                rut: rutInput.value,
                nombre: nombre.value,
                apellido: apellido.value,
                email: email.value,
                password: password.value,
                direccion: direccion.value,
                region: region.value,
                comuna: comuna.value,
                fechaNacimiento: f_nacimiento.value
            };
            usuarios.push(nuevoUsuario);
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
            alert('¡Usuario registrado con éxito! Se iniciará tu sesión.');
            
            localStorage.setItem('usuarioLogueado', JSON.stringify(nuevoUsuario));
            window.location.reload();
        }
    });

    nombre.addEventListener('input', () => validateRequired(nombre, 'nombre'));
    apellido.addEventListener('input', () => validateRequired(apellido, 'apellido'));
    direccion.addEventListener('input', () => validateRequired(direccion, 'dirección'));
    password.addEventListener('input', () => validateRequired(password, 'contraseña'));
    email.addEventListener('input', validateEmail);
    f_nacimiento.addEventListener('change', validateFecha);
    rutInput.addEventListener('input', validateRut);
    region.addEventListener('change', () => validateRequired(region, 'región'));
    comuna.addEventListener('change', () => validateRequired(comuna, 'comuna'));
});