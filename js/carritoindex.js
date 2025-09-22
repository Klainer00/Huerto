document.addEventListener("DOMContentLoaded", () => {
  const botones = document.querySelectorAll(".add-to-cart");
  const cartCount = document.getElementById("cart-count");

  // cargar carrito existente
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  actualizarContador();

  function actualizarContador() {
    cartCount.textContent = carrito.length;
  }

  botones.forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".card");
      const nombre = card.querySelector(".card-title").textContent;
      const precioTexto = card.querySelector(".price").textContent.replace(/\D/g, "");
      const precio = parseInt(precioTexto);
      const img = card.querySelector("img").src;

      const producto = { nombre, precio, cantidad: 1, img };

      carrito.push(producto);
      localStorage.setItem("carrito", JSON.stringify(carrito));

      actualizarContador();
    });
  });
});
