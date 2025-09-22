document.addEventListener('DOMContentLoaded', () => {

    const products = [
        { id: 'FR001', name: 'Manzanas Fuji', price: 1200, image: 'img/manzanaFuji.png', stock: 150 },
        { id: 'FR003', name: 'Plátanos Cavendish', price: 800, image: 'img/platano_caverdish.png', stock: 250 },
        { id: 'VR001', name: 'Zanahorias Orgánicas', price: 900, image: 'img/zanahorias.png', stock: 100 },
        { id: 'VR003', name: 'Pimientos Tricolores', price: 1500, image: 'img/pimienton.png', stock: 120 },
        { id: 'PO003', name: 'Quinua Orgánica', price: 1500, image: 'img/quinua.png', stock: 0 },
        { id: 'PL001', name: 'Leche Entera', price: 1000, image: 'img/leche.png', stock: 50 }
    ];

    let cart = JSON.parse(localStorage.getItem('huertoHogarCart')) || [];

    function updateCartCount() {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        }
    }

    function saveCart() {
        localStorage.setItem('huertoHogarCart', JSON.stringify(cart));
        updateCartCount();
    }

    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (!product || product.stock === 0) {
            alert('Producto no disponible o sin stock.');
            return;
        }
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            if (cartItem.quantity < product.stock) {
                cartItem.quantity++;
            } else {
                alert('No puedes añadir más unidades (stock máximo alcanzado).');
            }
        } else {
            cart.push({ id: productId, name: product.name, price: product.price, image: product.image, quantity: 1 });
        }
        saveCart();
        alert(`${product.name} ha sido añadido al carrito.`);
    }

    const productListContainer = document.getElementById('product-list');
    if (productListContainer) {
        products.forEach(product => {
            const productCol = document.createElement('div');
            productCol.className = 'col-lg-3 col-md-6';
            productCol.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body text-center">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text price">$${product.price} / unidad</p>
                        ${product.stock > 0
                            ? `<button class="btn btn-success add-to-cart" data-id="${product.id}">Añadir al Carrito</button>`
                            : `<button class="btn btn-secondary" disabled>Sin Stock</button>`
                        }
                    </div>
                </div>
            `;
            productListContainer.appendChild(productCol);
        });
    }

    document.body.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart')) {
            const productId = event.target.getAttribute('data-id');
            addToCart(productId);
        }
    });
    
    updateCartCount();
});