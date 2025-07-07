let allProducts = []; // Store all products globally
        let currentCategory = null; // Track the currently selected category

        // Function to fetch product data from the Fake Store API
        async function fetchProducts() {
            const spinner = document.getElementById('spinner');
            spinner.style.display = 'flex'; // Show the spinner

            try {
                const response = await fetch("https://fakestoreapi.com/products");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                allProducts = await response.json(); // Get the JSON response and store it
                renderProducts(allProducts); // Pass the data to render function
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                spinner.style.display = 'none'; // Hide the spinner
            }
        }

        // Function to render products
        function renderProducts(products) {
            const productContainer = document.getElementById('productContainer');
            productContainer.innerHTML = ''; // Clear existing content

            products.forEach(product => {
                const cardHTML = `
                    <div class="col-md-4 mb-4">
                        <div class="card">
                            <div class="card-img">
                                <div class="img" style="background-image: url('${product.image}');"></div>
                            </div>
                            <div class="card-title">${product.title}</div>
                            <div class="card-subtitle">${product.description.substring(0, 80)}...</div>
                            <hr class="card-divider">
                            <div class="card-footer">
                                <div class="card-price"><span>$</span> ${product.price.toFixed(2)}</div>
                                <button class="card-btn" aria-label="Add to cart">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="m397.78 316h-205.13a15 15 0 0 1 -14.65-11.67l-34.54-150.48a15 15 0 0 1 14.62-18.36h274.27a15 15 0 0 1 14.65 18.36l-34.6 150.48a15 15 0 0 1 -14.62 11.67zm-193.19-30h181.25l27.67-120.48h-236.6z"></path><path d="m222 450a57.48 57.48 0 1 1 57.48-57.48 57.54 57.54 0 0 1 -57.48 57.48zm0-84.95a27.48 27.48 0 1 0 27.48 27.47 27.5 27.5 0 0 0 -27.48-27.47z"></path><path d="m368.42 450a57.48 57.48 0 1 1 57.48-57.48 57.54 57.54 0 0 1 -57.48 57.48zm0-84.95a27.48 27.48 0 1 0 27.48 27.47 27.5 27.5 0 0 0 -27.48-27.47z"></path><path d="m158.08 165.49a15 15 0 0 1 -14.23-10.26l-25.71-77.23h-47.44a15 15 0 1 1 0-30h58.3a15 15 0 0 1 14.23 10.26l29.13 87.49a15 15 0 0 1 -14.23 19.74z"></path></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                productContainer.innerHTML += cardHTML;
            });
        }


        // Function to filter products by category
        function filterProductsByCategory(category) {
            currentCategory = category; // Update the current category
            const filteredProducts = allProducts.filter(product => product.category === category);
            renderProducts(filteredProducts); // Render the filtered products
        }

        // Function to sort products
        function sortProducts(criteria) {
            let sortedProducts;
            const filteredProducts = currentCategory ? allProducts.filter(product => product.category === currentCategory) : allProducts;

            switch (criteria) {
                case 'low-to-high':
                    sortedProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
                    break;
                case 'high-to-low':
                    sortedProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
                    break;
                case 'ratings':
                    sortedProducts = [...filteredProducts].sort((a, b) => b.rating.rate - a.rating.rate);
                    break;
                default:
                    sortedProducts = filteredProducts;
            }
            renderProducts(sortedProducts); // Render the sorted products
        }

        // Add event listeners to dropdown items for categories
        document.querySelectorAll('.dropdown-item[data-category]').forEach(item => {
            item.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default anchor behavior
                const category = event.target.getAttribute('data-category');
                filterProductsByCategory(category); // Filter products based on selected category
            });
        });

        // Add event listeners to dropdown items for sorting
        document.querySelectorAll('.dropdown-item[data-sort]').forEach(item => {
            item.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default anchor behavior
                const sortCriteria = event.target.getAttribute('data-sort');
                sortProducts(sortCriteria); // Sort products based on selected criteria
            });
        });

        // Function to generate star rating
        function getStars(rate) {
            const fullStars = Math.floor(rate);
            const halfStar = rate % 1 >= 0.5 ? '<i class="fas fa-star-half-alt"></i>' : '';
            const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
            return '<i class="fas fa-star"></i>'.repeat(fullStars) + halfStar + '<i class="fas fa-star text-secondary"></i>'.repeat(emptyStars);
        }

        
        // Initial fetch of products
        fetchProducts();