document.addEventListener('DOMContentLoaded', function() {
    

    const cartModalHTML = `
    <div class="modal fade" id="modalCarrito" tabindex="-1" aria-labelledby="modalCarritoLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header bg-success text-white">
                    <h5 class="modal-title" id="modalCarritoLabel"><i class="bi bi-cart4"></i> Carrito de Compras</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle text-center">
                            <thead class="table-light">
                                <tr>
                                    <th>Imagen</th>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Precio Unitario</th>
                                    <th>Subtotal</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="carrito-body"></tbody>
                        </table>
                    </div>
                    <div id="carrito-vacio" class="text-center text-muted mt-3 d-none">
                        <p>Tu carrito está vacío. ¡Añade algunos productos frescos!</p>
                    </div>
                    <div class="d-flex justify-content-end mt-3">
                        <h4>Total: <span id="total" class="text-success fw-bold">$0</span></h4>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" data-bs-dismiss="modal">Seguir Comprando</button>
                    <button class="btn btn-success" id="btnFinalizarCompra"><i class="bi bi-bag-check-fill"></i> Finalizar Compra</button>
                </div>
            </div>
        </div>
    </div>`;

    const toastHTML = `
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 1080">
        <div id="liveToast" class="toast align-items-center text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body" id="toast-body"></div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', cartModalHTML);
    document.body.insertAdjacentHTML('beforeend', toastHTML);


    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const carritoBody = document.getElementById("carrito-body");
    const totalEl = document.getElementById("total");
    const cartCount = document.getElementById("cart-count"); 
    const btnFinalizarCompra = document.getElementById('btnFinalizarCompra');
    const carritoVacioEl = document.getElementById('carrito-vacio');

    function renderCarrito() {
        carritoBody.innerHTML = "";
        let total = 0;
        let totalItems = 0;

        if (carrito.length === 0) {
            carritoVacioEl.classList.remove('d-none');
            if (btnFinalizarCompra) btnFinalizarCompra.disabled = true;
        } else {
            carritoVacioEl.classList.add('d-none');
            if (btnFinalizarCompra) btnFinalizarCompra.disabled = false;
            
            carrito.forEach((item, index) => {
                const subtotal = item.precio * item.cantidad;
                total += subtotal;
                totalItems += item.cantidad;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><img src="${item.img}" alt="${item.nombre}" width="50" class="rounded"></td>
                    <td>${item.nombre}</td>
                    <td><input type="number" min="1" value="${item.cantidad}" class="form-control form-control-sm w-75 mx-auto" data-index="${index}"></td>
                    <td>$${item.precio.toLocaleString('es-CL')}</td>
                    <td>$${subtotal.toLocaleString('es-CL')}</td>
                    <td><button class="btn btn-sm btn-danger" data-index="${index}">Eliminar<i class="bi bi-trash"></i></button></td>
                `;
                carritoBody.appendChild(row);
            });
        }

        totalEl.textContent = `$${total.toLocaleString('es-CL')}`;
        if (cartCount) cartCount.textContent = totalItems;
        localStorage.setItem("carrito", JSON.stringify(carrito));
        addEventListenersToCartRows();
    }

    function addEventListenersToCartRows() {
        carritoBody.querySelectorAll('input[type="number"]').forEach(input => {
            input.addEventListener('change', (e) => cambiarCantidad(e.currentTarget.dataset.index, parseInt(e.currentTarget.value)));
        });
        carritoBody.querySelectorAll('.btn-danger').forEach(btn => {
            btn.addEventListener('click', (e) => eliminarDelCarrito(e.currentTarget.dataset.index));
        });
    }

    window.addToCart = function(producto) {
        const existente = carrito.find(item => item.id === producto.id);
        if (existente) {
            existente.cantidad++;
        } else {
            carrito.push(producto);
        }
        showToast(`'${producto.nombre}' fue agregado al carrito.`);
        renderCarrito();
    }

    function cambiarCantidad(index, nuevaCantidad) {
        if (nuevaCantidad > 0) carrito[index].cantidad = nuevaCantidad;
        else carrito.splice(index, 1);
        renderCarrito();
    }

    function eliminarDelCarrito(index) {
        const nombreProducto = carrito[index].nombre;
        carrito.splice(index, 1);
        showToast(`'${nombreProducto}' fue eliminado del carrito.`, 'danger');
        renderCarrito();
    }

    document.querySelectorAll(".add-to-cart").forEach(btn => {
        btn.addEventListener("click", () => {
            const card = btn.closest(".card");
            const producto = {
                id: btn.dataset.id,
                nombre: card.querySelector(".card-title").textContent,
                precio: parseInt(card.querySelector(".price").textContent.replace(/\D/g, "")),
                img: card.querySelector("img").src,
                cantidad: 1
            };
            addToCart(producto);
        });
    });

    if (btnFinalizarCompra) {
        btnFinalizarCompra.addEventListener('click', () => {
            const usuarioLogueado = localStorage.getItem('usuarioLogueado');
            if (usuarioLogueado) {
                alert("PAGO EXITOSO. ¡Gracias por su compra!");
                carrito = [];
                window.location.href = 'index.html';
                renderCarrito();

            } else {
                const modalCarrito = bootstrap.Modal.getInstance(document.getElementById('modalCarrito'));
                if (modalCarrito) modalCarrito.hide();
                const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
                loginModal.show();
            }
        });
    }

    function showToast(message, type = 'success') {
        const toastBody = document.getElementById('toast-body');
        const toastEl = document.getElementById('liveToast');
        if (!toastBody || !toastEl) return;
        toastBody.textContent = message;
        toastEl.className = `toast align-items-center text-bg-${type} border-0`;
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    }

    renderCarrito();
});