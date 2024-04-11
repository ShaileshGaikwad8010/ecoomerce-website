document.addEventListener('DOMContentLoaded', function () {
    const checkboxes = document.querySelectorAll('input[name="category"]');
    const productsContainer = document.getElementById('products-container');
    const searchBar = document.getElementById('search-bar');
    const viewCartBtn = document.getElementById('view-cart-btn');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Fetch data from the API
    fetch('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json')
        .then(response => response.json())
        .then(data => {
            // Display all products first when no checkbox is checked
            displayProducts(data.categories);
            // Event listener for checkboxes
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', function () {
                    const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value);
                    const searchQuery = searchBar.value.trim().toLowerCase();
                    filterProducts(data.categories, selectedCategories, searchQuery);
                });
            });

            // Event listener for search bar submit
            searchBar.addEventListener('keydown', function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value);
                    const searchQuery = searchBar.value.trim().toLowerCase();
                    filterProducts(data.categories, selectedCategories, searchQuery);
                }
            });
        })
        .catch(error => console.error('Error fetching data:', error));

    // Function to filter products based on selected categories and search query
    function displayProducts(categories) {
        productsContainer.innerHTML = '';
        categories.forEach(category => {
            category.category_products.forEach(product => {
                const productElement = document.createElement('div');
                productElement.classList.add('product-card');
                productElement.innerHTML = `
                    <img src=${product.image}>
                    <br/>
                    <h6>${product.vendor}</h6>
                    <br/>
                    <h6>${product.badge_text}</h6>
                    <br/>
                    <h6>Price Rs. ${product.price} | <span>${product.compare_at_price}</span></h6>
                    <br/>
                    <h5>${product.title}</h5>
                    <button class="add-to-cart-btn" data-product='${JSON.stringify(product)}'>Add to Cart (${getQuantity(product.id)})</button>
                    
                `;
                productsContainer.appendChild(productElement);
            });
        });
        // Attach event listeners to Add to Cart and Remove from Cart buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', addToCart);
        });
        document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
            button.addEventListener('click', removeFromCart);
        });
    }

    // Function to filter products based on selected categories and search query
    function filterProducts(categories, selectedCategories, searchQuery) {
        const filteredProducts = categories.filter(category => {
            return selectedCategories.length === 0 || selectedCategories.includes(category.category_name);
        }).map(category => {
            return {
                category_products: category.category_products.filter(product => {
                    const categoryMatch = category.category_name.toLowerCase().includes(searchQuery);
                    const titleMatch = product.title.toLowerCase().includes(searchQuery);
                    const vendorMatch = product.vendor.toLowerCase().includes(searchQuery);
                    return titleMatch || vendorMatch || categoryMatch;
                })
            };
        });
        displayProducts(filteredProducts);
    }

    // Function to get the quantity of a product in the cart
    function getQuantity(productId) {
        const productInCart = cart.find(item => item.id === productId);
        return productInCart ? productInCart.quantity : 0;
    }

    // Function to add a product to the cart
    function addToCart(event) {
        const product = JSON.parse(event.target.dataset.product);

        // Check if the product already exists in the cart
        const existingProductIndex = cart.findIndex(item => item.id === product.id);

        if (existingProductIndex !== -1) {
            // If the product exists, increase its quantity
            cart[existingProductIndex].quantity++;
        } else {
            // If the product doesn't exist, add it to the cart with quantity 1
            product.quantity = 1;
            cart.push(product);
        }

        // Save the updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Update the quantity displayed in the "Add to Cart" button
        event.target.textContent = `Add to Cart (${getQuantity(product.id)})`;
    }

// Function to remove a product from the cart





    // Function to display cart items
    function displayCart() {
        // Implementation remains the same
    }

    // Event listener for View Cart button
    viewCartBtn.addEventListener('click', function () {
        // Navigate to cart.html
        window.location.href = 'cart.html';
    });
});
