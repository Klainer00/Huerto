document.addEventListener('DOMContentLoaded', () => {

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const carritoBody = document.getElementById("carrito-body");
    const totalEl = document.getElementById("total");
    const toastEl = document.getElementById('liveToast');
    const toastBody = document.getElementById('toast-body');
    const modalCarrito = new bootstrap.Modal(document.getElementById('modalCarrito'));
    const btnFinalizarCompra = document.getElementById('btnFinalizarCompra');


    const guardarCarrito = () => {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    };

    const renderCarrito = () => {
        if (!carritoBody || !totalEl) {
            return;
        }

        carritoBody.innerHTML = "";
        let total = 0;

        if (carrito.length === 0) {
            carritoBody.innerHTML = '<tr><td colspan="6" class="text-center">Tu carrito está vacío.</td></tr>';
        } else {
            carrito.forEach((item, index) => {
                const subtotal = item.precio * item.cantidad;
                total += subtotal;

                const row = `
                    <tr>
                      <td><img src="${item.img}" alt="${item.nombre}" style="width: 50px; height: 50px; object-fit: cover;"></td>
                      <td class="align-middle">${item.nombre}</td>
                      <td class="align-middle">
                        <input type="number" min="1" value="${item.cantidad}" 
                               class="form-control form-control-sm mx-auto" style="width: 60px;"
                               onchange="cambiarCantidad(${index}, this.value)">
                      </td>
                      <td class="align-middle">$${item.precio.toLocaleString()}</td>
                      <td class="align-middle fw-bold">$${subtotal.toLocaleString()}</td>
                      <td class="align-middle">
                        <button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito(${index})">
                          <i class="bi bi-trash"></i> Eliminar
                        </button>
                      </td>
                    </tr>
                `;
                carritoBody.innerHTML += row;
            });
        }
        totalEl.textContent = `$${total.toLocaleString()}`;
        guardarCarrito();
    };
    
    const addToCart = (producto) => {
        const existente = carrito.find(item => item.id === producto.id);

        if (existente) {
            existente.cantidad++;
        } else {
            carrito.unshift({ ...producto, cantidad: 1 });
        }
        
        showToast(`"${producto.nombre}" fue agregado al carrito.`);
        renderCarrito();
    };

    const showToast = (message, type = 'success') => {
        if (toastEl && toastBody) {
            toastBody.textContent = message;
            toastEl.className = `toast align-items-center text-bg-${type} border-0`;
            const toast = new bootstrap.Toast(toastEl);
            toast.show();
        }
    };
    
    window.cambiarCantidad = (index, nuevaCantidad) => {
        const cantidad = parseInt(nuevaCantidad);
        if (cantidad > 0) {
            carrito[index].cantidad = cantidad;
        } else {
            eliminarDelCarrito(index);
        }
        renderCarrito();
    };

    window.eliminarDelCarrito = (index) => {
        const nombreProducto = carrito[index].nombre;
        carrito.splice(index, 1);
        showToast(`"${nombreProducto}" fue eliminado del carrito.`, 'danger');
        renderCarrito();
    };

    document.querySelectorAll(".add-to-cart").forEach(btn => {
        btn.addEventListener("click", () => {
            const card = btn.closest(".card");
            if (card) {
                const producto = {
                    id: btn.dataset.id,
                    nombre: card.querySelector(".card-title").textContent,
                    precio: parseInt(card.querySelector(".price").textContent.replace(/[$./ a-zA-Z]/g, '')),
                    img: card.querySelector("img").src,
                };
                addToCart(producto);
            }
        });
    });

    renderCarrito();

btnFinalizarCompra.addEventListener('click', () => {
    showToast('¡Gracias por su compra!', 'success');
    carrito = []; 
    guardarCarrito(); 
    renderCarrito(); 
    modalCarrito.hide();
});

});