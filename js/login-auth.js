document.addEventListener('DOMContentLoaded', function () {

    const loginModalHTML = `
    <div class="modal fade" id="loginModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header"><h4 class="w-100 text-center title-font">Iniciar Sesión</h4><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
                <div class="modal-body p-4">
                    <div class="text-center mb-4"><img src="../img/Logo-convertido-a-pequeño-Photoroom.png" alt="Logo" style="width: 150px;"></div>
                    <form id="login-form-modal">
                        <div id="error-message-modal" class="alert alert-danger d-none"></div>
                        <div class="mb-3"><label for="modal-email" class="form-label">Correo Electrónico</label><input type="email" class="form-control" id="modal-email" required></div>
                        <div class="mb-3"><label for="modal-password" class="form-label">Contraseña</label><input type="password" class="form-control" id="modal-password" required></div>
                        <div class="text-center"><button type="submit" class="btn btn-success w-100">Ingresar</button></div>
                    </form>
                </div>
            </div>
        </div>
    </div>`;

    const registroModalHTML = `
    <div class="modal fade" id="registroModal" tabindex="-1" aria-labelledby="registroModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="w-100 text-center" id="registroModalLabel">Crear una Cuenta en Huerto Hogar</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="formRegistroModal" novalidate>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="reg-rut" class="form-label">RUT</label>
                                <input type="text" class="form-control" id="reg-rut" onkeyup="checkRut(this) " required maxlength="10" placeholder="12345678-9">
                                <div class="invalid-feedback">RUT inválido.</div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="reg-nombre" class="form-label">Nombre</label>
                                <input type="text" class="form-control" id="reg-nombre" required maxlength="50">
                                <div class="invalid-feedback">El nombre es requerido (máx. 50 caracteres).</div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="reg-apellido" class="form-label">Apellido</label>
                                <input type="text" class="form-control" id="reg-apellido" required maxlength="100">
                                <div class="invalid-feedback">El apellido es requerido (máx. 100 caracteres).</div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="reg-email" class="form-label">Email</label>
                                <input type="email" class="form-control" id="reg-email" required>
                                <div class="invalid-feedback">Email inválido o no permitido.</div>
                            </div>
                             <div class="col-md-6 mb-3">
                                <label for="reg-password" class="form-label">Contraseña</label>
                                <input type="password" class="form-control" id="reg-psw" required minlength="4" maxlength="10">
                                <div class="invalid-feedback">La contraseña debe tener entre 4 y 10 caracteres.</div>
                            </div>
                             <div class="col-md-6 mb-3">
                                <label for="reg-direccion" class="form-label">Dirección</label>
                                <input type="text" class="form-control" id="reg-direccion" required maxlength="300">
                                <div class="invalid-feedback">La dirección es requerida.</div>
                            </div>
                             <div class="col-md-6 mb-3">
                                <label for="fecha_nacimiento" class="form-label">Fecha de Nacimiento:</label>
                                <input type="date" class="form-control" id="reg-fecha_nacimiento">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="reg-region" class="form-label">Región</label>
                                <select class="form-select" id="reg-region" required></select>
                                <div class="invalid-feedback">Debe seleccionar una región.</div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="reg-comuna" class="form-label">Comuna</label>
                                <select class="form-select" id="reg-comuna" required></select>
                                <div class="invalid-feedback">Debe seleccionar una comuna.</div>
                            </div>
                        </div>
                        <div class="modal-footer mt-3">
                           <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                           <button type="submit" class="btn btn-success">Registrarse</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', loginModalHTML);
    document.body.insertAdjacentHTML('beforeend', registroModalHTML);
    const navbarItemsContainer = document.getElementById('navbar-items-container');
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));

    if (navbarItemsContainer) {
        if (usuarioLogueado) {
            const bienvenidaMessage = `<li class="nav-item"><a class="nav-link">¡Hola, ${usuarioLogueado.nombre}!</a></li>`;
            const logoutButton = `<li class="nav-item"><a class="nav-link text-danger" href="#" id="logout-button" style="cursor: pointer; font-weight: bold;">Cerrar Sesión</a></li>`;
            navbarItemsContainer.insertAdjacentHTML('beforeend',bienvenidaMessage);
            navbarItemsContainer.insertAdjacentHTML('beforeend', logoutButton);
            
            document.getElementById('logout-button')?.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('usuarioLogueado');
                window.location.reload();
            });

        } else {
            const loginButton = `<li class="nav-item"><a class="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#loginModal">Iniciar Sesión</a></li>`;
            const registerButton = `<li class="nav-item"><a class="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#registroModal">Registro</a></li>`;
            navbarItemsContainer.insertAdjacentHTML('beforeend', loginButton);
            navbarItemsContainer.insertAdjacentHTML('beforeend', registerButton);
        }
    }
});