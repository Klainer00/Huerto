document.addEventListener('DOMContentLoaded', () => {
    function cargarUsuarios() {
        fetch('data/usuarios.json')
        .then(response =>response.json())
        .then(data => {
            const tablaBody = document.getElementById('tabla-usuarios');
            tablaBody.innerHTML = '';
            data.usuarios.forEach(usuario =>{
                const fila = document.createElement('tr');
                fila.innerHTML = `
                <td>${usuario.id}</td>
                <td>${usuario.rut}</td>
                <td>${usuario.nombre}</td>
                <td>${usuario.email}</td>
                <td>${usuario.rol}</td>
                <td><span class="badge bg-success">${usuario.estado}</span></td>
                <td>
                    <button class="btn btn-primary btn-sm">Editar</button>
                    <button class="btn btn-danger btn-sm">Eliminar</button>
                </td>
                `;
                tablaBody.appendChild(fila);

            });
        }).catch(error=> console.error('Error al cargar los usuarios',error))
    }
     cargarUsuarios();
    const btnAbrirModal = document.getElementById('btn-abrir-modal');
    const modalRegistro = document.getElementById('modal-registro');
    btnAbrirModal.addEventListener('click', ()=>{
        fetch('modal-agregar-usuario.html')
        .then(response =>response.text())
        .then(html =>{
            modalRegistro.innerHTML = html;
            const modalElement = document.getElementById('modalAgregarUsuario');
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        })
        .catch(error => console.error('Error al cargar el modal', error));
    })
})
console.log('hola');