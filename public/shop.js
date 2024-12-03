document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("productList");
    const searchInput = document.getElementById("searchInput");
    const filterSelectCycle = document.getElementById("filterSelectCycle");
    const filterSelectWatering = document.getElementById("filterSelectWatering");
    const sortSelect = document.getElementById("sortSelect");

    const apiUrl = "https://perenual.com/api/species-care-guide-list?key=sk-rglv67474d408f0be7804&page=1";

    let products = []; 

    // Fetch and display product data
    function fetchProducts() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                products = data.data.map(item => ({
                    id: item.id,
                    name: item.common_name || "Unknown Name",
                    scientific_name: item.scientific_name || "Unknown Scientific Name",
                    watering: item.watering ? item.watering.toLowerCase() : "not specified",
                    cycle: item.cycle ? item.cycle.toLowerCase() : "not specified",
                    imageUrl: item.default_image?.regular_url || "https://via.placeholder.com/300x200",
                }));
                displayProducts(products);
            })
            .catch(error => {
                console.error("Error fetching product data:", error);
                document.getElementById("loadingIndicator").innerHTML = `<p class='text-danger'>Failed to load products: ${error.message}</p>`;
            });
    }

    // Display products dynamically
    function displayProducts(productsToDisplay) {
        productList.innerHTML = "";
        if (productsToDisplay.length === 0) {
            productList.innerHTML = "<p class='text-muted'>No products match your criteria.</p>";
            return;
        }
        productsToDisplay.forEach(product => {
            const productCard = `
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">Scientific Name: ${product.scientific_name}</p>
                            <p class="card-text">Watering: ${product.watering}</p>
                            <p class="card-text">Cycle: ${product.cycle}</p>
                            <button class="btn btn-success">Add to Cart</button>
                        </div>
                    </div>
                </div>
            `;
            productList.innerHTML += productCard;
        });
    }

    // Search and filter logic
    searchInput.addEventListener("input", handleSearch);
    filterSelectCycle.addEventListener("change", handleFilter);
    filterSelectWatering.addEventListener("change", handleFilter);
    sortSelect.addEventListener("change", handleSort);

    // Filtering function
    function handleFilter() {
        let filteredProducts = [...products];
        const selectedCycle = filterSelectCycle.value;
        const selectedWatering = filterSelectWatering.value;

        if (selectedCycle !== "all") {
            filteredProducts = filteredProducts.filter(product => product.cycle === selectedCycle.toLowerCase());
        }

        if (selectedWatering !== "all") {
            filteredProducts = filteredProducts.filter(product => product.watering === selectedWatering.toLowerCase());
        }

        displayProducts(filteredProducts);
    }

    // Sorting function
    function handleSort() {
        const sortValue = sortSelect.value;
        let sortedProducts = [...products];

        if (sortValue === "name-asc") {
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortValue === "name-desc") {
            sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        }

        displayProducts(sortedProducts);
    }

    // Search function
    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchTerm));
        displayProducts(filteredProducts);
    }

    // Initial fetch
    fetchProducts();
});
