let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const carritoBody = document.getElementById("carrito-body");
const totalEl = document.getElementById("total");
const cartCount = document.getElementById("cart-count");

function renderCarrito() {
  if (carritoBody) carritoBody.innerHTML = "";
  let total = 0;

  carrito.forEach((item, index) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    if (carritoBody) {
      const row = `
        <tr>
          <td><img src="${item.img}" alt="${item.nombre}" width="50"></td>
          <td>${item.nombre}</td>
          <td>
            <input type="number" min="1" value="${item.cantidad}" 
                class="form-control form-control-sm" 
                onchange="cambiarCantidad(${index}, this.value)">
          </td>
          <td>$${item.precio.toLocaleString()}</td>
          <td>$${subtotal.toLocaleString()}</td>
          <td>
            <button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito(${index})">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      `;
      carritoBody.innerHTML += row;
    }
  });

  if (totalEl) totalEl.textContent = `$${total.toLocaleString()}`;
  if (cartCount) cartCount.textContent = carrito.length;

  // Guardar en localStorage
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Añadir al carrito
function addToCart(producto) {
  const existente = carrito.find(item => item.id === producto.id);

  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push(producto);
  }

  renderCarrito();
}

// Cambiar cantidad
function cambiarCantidad(index, nuevaCantidad) {
  carrito[index].cantidad = parseInt(nuevaCantidad);
  renderCarrito();
}

// Eliminar producto
function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  renderCarrito();
}

// Detectar clicks en botones
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

    const originalText = btn.textContent;
    btn.textContent = "Producto agregado";
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
    }, 1500);
  });
});

// Función para mostrar toast en lugar de una alerta
function showToast(message, type = 'success') {
  const toastBody = document.getElementById('toast-body');
  if (!toastBody) return;
  toastBody.textContent = message;

  const toastEl = document.getElementById('liveToast');
  if (!toastEl) return;
  toastEl.className = `toast align-items-center text-bg-${type} border-0`;
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}

renderCarrito();