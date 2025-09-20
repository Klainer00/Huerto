document.addEventListener('DOMContentLoaded', () => {

    let datosJSON = { productos: [] };
    const tablaBody = document.getElementById('tabla-productos');
    const modalAgregar = new bootstrap.Modal(document.getElementById('modalAgregarProducto'));

    function cargarProductos() {
        fetch('data/productos.json')
            .then(response => response.json())
            .then(data => {
                datosJSON = data;
                renderizarTabla();
            })
            .catch(error => console.error('Error al cargar los productos:', error));
    }

    function renderizarTabla() {
        tablaBody.innerHTML = '';
        datosJSON.productos.forEach(producto => {
            const fila = document.createElement('tr');
            const stockClass = producto.stock <= producto.stock_critico ? 'text-danger fw-bold' : '';
            
            fila.innerHTML = `
                <td>${producto.codigo}</td>
                <td>${producto.nombre}</td>
                <td>$${producto.precio.toLocaleString('es-CL')}</td>
                <td class="${stockClass}">${producto.stock}</td>
                <td>${producto.categoria}</td>
                <td><img src="${producto.imagen}" alt="${producto.nombre}" style="width: 50px; height: auto;"></td>
                <td>
                    <button class="btn btn-primary btn-sm btn-editar" data-codigo="${producto.codigo}">Editar</button>
                    <button class="btn btn-danger btn-sm btn-eliminar" data-codigo="${producto.codigo}">Eliminar</button>
                </td>
            `;
            tablaBody.appendChild(fila);
        });
    }

    function crearProducto() {
        const codigo = document.getElementById('codigo').value.trim();
        const nombre = document.getElementById('nombre').value.trim();
        const descripcion = document.getElementById('descripcion').value.trim();
        const precio = parseFloat(document.getElementById('precio').value);
        const stock = parseInt(document.getElementById('stock').value);
        const stock_critico = parseInt(document.getElementById('stock_critico').value) || 0;
        const categoria = document.getElementById('categoria').value;
        const imagen = document.getElementById('imagen').value.trim();

        if (!codigo || !nombre || isNaN(precio) || isNaN(stock) || !categoria) {
            alert('Código, Nombre, Precio, Stock y Categoría son campos requeridos.');
            return;
        }

        if (datosJSON.productos.some(p => p.codigo === codigo)) {
            alert('El código de producto ya existe.');
            return;
        }

        const nuevoProducto = {
            codigo, nombre, descripcion, precio, stock, stock_critico, categoria, imagen
        };

        datosJSON.productos.push(nuevoProducto);
        renderizarTabla();
        modalAgregar.hide();
        document.getElementById('formAgregarProducto').reset();
    }

    function eliminarProducto(codigo) {
        if (confirm(`¿Estás seguro de que deseas eliminar el producto con código ${codigo}?`)) {
            datosJSON.productos = datosJSON.productos.filter(p => p.codigo !== codigo);
            renderizarTabla();
        }
    }

    document.getElementById('btn-guardar-nuevo').addEventListener('click', crearProducto);

    tablaBody.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('btn-eliminar')) {
            const codigo = target.getAttribute('data-codigo');
            eliminarProducto(codigo);
        }
        if (target.classList.contains('btn-editar')) {
            alert('La funcionalidad de editar aún no está implementada.');
        }
    });

    cargarProductos();
});