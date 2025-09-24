document.addEventListener('DOMContentLoaded', () => {

    
    let datosJSON = JSON.parse(localStorage.getItem('usuariosAdmin')) || { usuarios: [] };
    
    const tablaBody = document.getElementById('tabla-usuarios');
    const paginacionContainer = document.getElementById('paginacion');
    let paginaActual = 1;
    const filasPorPagina = 10;

    const modalAgregar = new bootstrap.Modal(document.getElementById('modalAgregarUsuario'));
    const modalEditar = new bootstrap.Modal(document.getElementById('modalEditarUsuario'));

    const regionSelect = document.getElementById('region');
    const comunaSelect = document.getElementById('comuna');
    const editRegionSelect = document.getElementById('edit-region');
    const editComunaSelect = document.getElementById('edit-comuna');


    const guardarUsuarios = () => {
        localStorage.setItem('usuariosAdmin', JSON.stringify(datosJSON));
    };

    function cargarRegiones(selectElement) {
        selectElement.innerHTML = '<option value="">Seleccione una región</option>';
        if (window.regionesComunas) {
            regionesComunas.regiones.forEach(region => {
                const option = document.createElement('option');
                option.value = region.region;
                option.textContent = region.region;
                selectElement.appendChild(option);
            });
        }
    }

    function cargarComunas(regionSeleccionada, selectComunaElement) {
        selectComunaElement.innerHTML = '<option value="">Seleccione una comuna</option>';
        if (window.regionesComunas) {
            const regionData = regionesComunas.regiones.find(r => r.region === regionSeleccionada);
            if (regionData) {
                regionData.comunas.forEach(comuna => {
                    const option = document.createElement('option');
                    option.value = comuna;
                    option.textContent = comuna;
                    selectComunaElement.appendChild(option);
                });
            }
        }
    }
    
    regionSelect.addEventListener('change', () => cargarComunas(regionSelect.value, comunaSelect));
    editRegionSelect.addEventListener('change', () => cargarComunas(editRegionSelect.value, editComunaSelect));

 
    function cargarUsuarios() {
        if (datosJSON.usuarios.length > 0) {
            mostrarPagina(1);
        } else {
            fetch('../data/usuarios.json')
                .then(response => response.json())
                .then(data => {
                    datosJSON = data;
                    guardarUsuarios(); 
                    mostrarPagina(1);
                })
                .catch(error => console.error('Error al cargar los usuarios iniciales:', error));
        }
    }

    function mostrarPagina(pagina) {
        paginaActual = pagina;
        renderizarTabla();
        renderizarPaginacion();
    }

    function renderizarTabla() {
        tablaBody.innerHTML = '';
        const inicio = (paginaActual - 1) * filasPorPagina;
        const fin = inicio + filasPorPagina;
        const usuariosDeLaPagina = datosJSON.usuarios.slice(inicio, fin);

        usuariosDeLaPagina.forEach(usuario => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${usuario.id}</td>
                <td>${usuario.rut}</td>
                <td>${usuario.nombre +' '+ usuario.apellido}</td>
                <td>${usuario.email}</td>
                <td>${usuario.rol}</td>
                <td>${usuario.region}</td>
                <td>${usuario.comuna}</td>
                <td>${usuario.direccion}</td>
                
                <td>
                    <button class="btn btn-primary btn-sm btn-editar" data-id="${usuario.id}">Editar</button>
                    <button class="btn btn-danger btn-sm btn-eliminar" data-id="${usuario.id}">Eliminar</button>
                </td>
            `;
            tablaBody.appendChild(fila);
        });
    }

    function renderizarPaginacion() {
        paginacionContainer.innerHTML = '';
        const totalPaginas = Math.ceil(datosJSON.usuarios.length / filasPorPagina);
        if (totalPaginas <= 1) return;

        const liPrevio = document.createElement('li');
        liPrevio.className = `page-item ${paginaActual === 1 ? 'disabled' : ''}`;
        liPrevio.innerHTML = `<a class="page-link" href="#" data-page="${paginaActual - 1}">Anterior</a>`;
        paginacionContainer.appendChild(liPrevio);

        for (let i = 1; i <= totalPaginas; i++) {
            const li = document.createElement('li');
            li.className = `page-item ${i === paginaActual ? 'active' : ''}`;
            li.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
            paginacionContainer.appendChild(li);
        }

        const liSiguiente = document.createElement('li');
        liSiguiente.className = `page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`;
        liSiguiente.innerHTML = `<a class="page-link" href="#" data-page="${paginaActual + 1}">Siguiente</a>`;
        paginacionContainer.appendChild(liSiguiente);
    }
    
    function crearUsuario() {
        const rutInput = document.getElementById('rut');
        const rut = rutInput.value.trim();
        const nombre = document.getElementById('nombre').value.trim();
        const apellido = document.getElementById('apellido').value.trim();
        const email = document.getElementById('email').value.trim();
        const fecha_nacimiento = document.getElementById('fecha_nacimiento').value;
        const direccion = document.getElementById('direccion').value.trim();
        const region = document.getElementById('region').value;
        const comuna = document.getElementById('comuna').value;
        const rol = document.getElementById('rol').value;
        const psw = document.getElementById('psw').value;
        

        if (!rut || !nombre || !apellido || !email || !direccion || !region || !comuna || !rol || !psw) {
            alert('Todos los campos son requeridos, excepto la fecha de nacimiento.');
            return;
        }

        if (rutInput.checkValidity && !rutInput.checkValidity()) {
            alert('El RUT ingresado no es válido.');
            return;
        }
        
        const emailRegex = /^[\w-\.]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
        if (!emailRegex.test(email)) {
            alert('El correo debe ser de dominio @duoc.cl, @profesor.duoc.cl o @gmail.com.');
            return;
        }

        const maxId = datosJSON.usuarios.length > 0 ? Math.max(...datosJSON.usuarios.map(u => u.id)) : 0;
        
        const nuevoUsuario = {
            id: maxId + 1, rut, nombre, apellido, email, fecha_nacimiento, direccion, region, comuna, rol,
            estado: 'Activo'
        };

        datosJSON.usuarios.push(nuevoUsuario);
        guardarUsuarios();
        const totalPaginas = Math.ceil(datosJSON.usuarios.length / filasPorPagina);
        mostrarPagina(totalPaginas);
        modalAgregar.hide();
        document.getElementById('formAgregarUsuario').reset();
    }

    function actualizarUsuario() {
        const id = document.getElementById('edit-id').value;
        const rut = document.getElementById('edit-rut').value.trim();
        const nombre = document.getElementById('edit-nombre').value.trim();
        const apellido = document.getElementById('edit-apellido').value.trim();
        const email = document.getElementById('edit-email').value.trim();
        const fecha_nacimiento = document.getElementById('edit-fecha_nacimiento').value;
        const direccion = document.getElementById('edit-direccion').value.trim();
        const region = document.getElementById('edit-region').value;
        const comuna = document.getElementById('edit-comuna').value;
        const rol = document.getElementById('edit-rol').value;
        
        const userIndex = datosJSON.usuarios.findIndex(u => u.id == id);
        
        if (userIndex !== -1) {
            datosJSON.usuarios[userIndex] = { 
                ...datosJSON.usuarios[userIndex], 
                rut, nombre, apellido, email, fecha_nacimiento, direccion, region, comuna, rol
            };
            guardarUsuarios(); 
            mostrarPagina(paginaActual);
            modalEditar.hide();
        }
    }

    function eliminarUsuario(idUsuario) {
        if (confirm(`¿Estás seguro de eliminar al usuario con ID ${idUsuario}?`)) {
            datosJSON.usuarios = datosJSON.usuarios.filter(u => u.id != idUsuario);
            guardarUsuarios(); 
            if ((paginaActual - 1) * filasPorPagina >= datosJSON.usuarios.length && paginaActual > 1) {
                paginaActual--;
            }
            mostrarPagina(paginaActual);
        }
    }
    
    document.getElementById('btn-guardar-nuevo').addEventListener('click', crearUsuario);
    document.getElementById('btn-guardar-cambios').addEventListener('click', actualizarUsuario);

    paginacionContainer.addEventListener('click', (event) => {
        event.preventDefault();
        const target = event.target;
        if (target.tagName === 'A' && !target.parentElement.classList.contains('disabled')) {
            const pagina = parseInt(target.getAttribute('data-page'));
            mostrarPagina(pagina);
        }
    });

    tablaBody.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('btn-editar')) {
            const idUsuario = target.getAttribute('data-id');
            const usuario = datosJSON.usuarios.find(u => u.id == idUsuario);
            if (usuario) {
                document.getElementById('edit-id').value = usuario.id;
                document.getElementById('edit-rut').value = usuario.rut;
                document.getElementById('edit-nombre').value = usuario.nombre;
                document.getElementById('edit-apellido').value = usuario.apellido;
                document.getElementById('edit-email').value = usuario.email;
                document.getElementById('edit-fecha_nacimiento').value = usuario.fecha_nacimiento;
                document.getElementById('edit-direccion').value = usuario.direccion;
                document.getElementById('edit-rol').value = usuario.rol;
                
                editRegionSelect.value = usuario.region;
                cargarComunas(usuario.region, editComunaSelect);
                editComunaSelect.value = usuario.comuna;
                
                modalEditar.show();
            }
        }
        if (target.classList.contains('btn-eliminar')) {
            const idUsuario = target.getAttribute('data-id');
            eliminarUsuario(idUsuario);
        }
    });

    cargarUsuarios();
    cargarRegiones(regionSelect);
    cargarRegiones(editRegionSelect);
});