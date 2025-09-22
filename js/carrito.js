document.addEventListener("DOMContentLoaded", () => {
  const carritoBody = document.getElementById("carrito-body");
  const totalElement = document.getElementById("total");
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  function renderCarrito() {
    carritoBody.innerHTML = "";
    let total = 0;

    carrito.forEach((producto, index) => {
      const subtotal = producto.precio * producto.cantidad;
      total += subtotal;

      const fila = `
        <tr>
          <td><img src="${producto.img}" class="img-fluid rounded" style="width:70px"></td>
          <td>${producto.nombre}</td>
          <td>
            <input type="number" class="form-control text-center cantidad" data-index="${index}" value="${producto.cantidad}" min="1">
          </td>
          <td>$${producto.precio}</td>
          <td class="fw-semibold">$${subtotal}</td>
          <td>
            <button class="btn btn-danger btn-sm eliminar" data-index="${index}">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      `;
      carritoBody.innerHTML += fila;
    });

    totalElement.textContent = "$" + total;
  }

  renderCarrito();

  carritoBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("eliminar") || e.target.closest(".eliminar")) {
      const index = e.target.dataset.index || e.target.closest(".eliminar").dataset.index;
      carrito.splice(index, 1);
      localStorage.setItem("carrito", JSON.stringify(carrito));
      renderCarrito();
    }
  });

  carritoBody.addEventListener("change", (e) => {
    if (e.target.classList.contains("cantidad")) {
      const index = e.target.dataset.index;
      carrito[index].cantidad = parseInt(e.target.value);
      localStorage.setItem("carrito", JSON.stringify(carrito));
      renderCarrito();
    }
  });
});
