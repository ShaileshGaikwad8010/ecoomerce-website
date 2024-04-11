document.addEventListener('DOMContentLoaded', function () {
    const productsContainer = document.getElementById('products-container1');
    const totalPriceSpan = document.getElementById('total-price');
    let cart = JSON.parse(localStorage.getItem('cart'));

    // Display cart items
    function displayCart() {
        productsContainer.innerHTML = '';
        let total = 0;
        cart.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');

            productCard.innerHTML = `
                <img src="${product.image}">
                <br/>
                <h6>${product.vendor}</h6>
                <br/>
                <h6>${product.badge_text || ''}</h6>
                <br/>
                <h6>Price Rs. ${product.price} | <span>${product.compare_at_price}</span></h6>
                <br/>
                <h5>${product.title}</h5>
                <h6>Quantity: ${product.quantity}</h6>
                <h6>Total: Rs. ${product.price * product.quantity}</h6>
                <button class="remove-from-cart-btn" data-product-id="${product.id}">Remove from Cart (${product.quantity})</button>
            `;
            productsContainer.appendChild(productCard);
            total += parseFloat(product.price) * product.quantity;
        });
        totalPriceSpan.textContent = total.toFixed(2);

        // Attach event listeners to Remove from Cart buttons
        document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
            button.addEventListener('click', removeFromCart);
        });
    }

    // Function to remove a product from the cart
    function removeFromCart(event) {
        const productId = event.target.dataset.productId;

        // Check if the product exists in the cart
        const existingProductIndex = cart.findIndex(item => item.id === productId);

        if (existingProductIndex !== -1) {
            // If the product exists, decrease its quantity or remove it if quantity becomes 0
            if (cart[existingProductIndex].quantity > 1) {
                cart[existingProductIndex].quantity--;
            } else {
                cart.splice(existingProductIndex, 1);
            }

            // Save the updated cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));

            // Refresh cart display
            displayCart();
        }
    }

    // Display cart initially
    displayCart();
});
